// No test-library dependency: exercise the production build through Chrome's DevTools protocol.
// Run after `npm run build`: node scripts/browser-smoke.mjs
// CHROME_PATH can point to another Chromium browser. Screenshots go to .checks/.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import assert from 'node:assert/strict'

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const browserPath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/chromium', '/usr/bin/google-chrome',
].find(existsSync)
assert(browserPath, 'Set CHROME_PATH to a Chromium browser executable.')
const profile = await mkdtemp(join(tmpdir(), 'lily-letter-browser-'))
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5179', '--strictPort'], { windowsHide: true, stdio: 'ignore' })
const browser = spawn(browserPath, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9227', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
let socket
const errors = []
async function waitFor(check, message) {
  for (let attempt = 0; attempt < 150; attempt++) {
    try { if (await check()) return } catch { /* Startup or navigation still in progress. */ }
    await pause(100)
  }
  throw new Error(`Timed out: ${message}`)
}

try {
  await waitFor(async () => (await fetch('http://127.0.0.1:5179')).ok, 'preview server')
  await waitFor(async () => (await fetch('http://127.0.0.1:9227/json')).ok, 'browser')
  const targets = await (await fetch('http://127.0.0.1:9227/json')).json()
  socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  let sequence = 0
  const pending = new Map()
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails)
    if (message.id) {
      const call = pending.get(message.id)
      if (call) { pending.delete(message.id); message.error ? call.reject(message.error) : call.resolve(message.result) }
    }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const click = async (text) => {
    assert(await evaluate(`Boolean([...document.querySelectorAll('button')].find(b => b.textContent.includes(${JSON.stringify(text)})))`), `Button exists: ${text}`)
    await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.includes(${JSON.stringify(text)})).click()`)
    await pause(100)
  }
  const viewport = async (width, height = 900) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 640 })
    await pause(150)
  }
  const noOverflow = async (name) => assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `${name}: no horizontal overflow`)
  await mkdir('.checks', { recursive: true })
  const screenshot = async (name) => {
    await pause(650)
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(resolve('.checks', `${name}.png`), Buffer.from(data, 'base64'))
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await viewport(390, 844)
  await send('Page.navigate', { url: 'http://127.0.0.1:5179' })
  await waitFor(() => evaluate("Boolean(document.querySelector('#welcome-title'))"), 'welcome')
  await evaluate('Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 4000))]).then(() => true)')
  // Sample the growth/glow timeline directly so this check is deterministic.
  await evaluate("document.querySelector('.welcome-flower-left .lily-glow').getAnimations().forEach(a => { a.pause(); a.currentTime = 1000 })")
  assert(await evaluate("getComputedStyle(document.querySelector('.welcome-flower-left .lily-glow')).opacity === '0'"), 'Pollen glow waits for growth')
  await evaluate("document.querySelectorAll('.welcome .lily-growth, .welcome .lily-bloom, .welcome .lily-glow').forEach(el => el.getAnimations().forEach(a => { a.pause(); const t = a.effect.getTiming(); a.currentTime = a.animationName === 'pollen-glow' ? t.delay + 2500 : t.delay + t.duration }))")
  assert(await evaluate("Number(getComputedStyle(document.querySelector('.welcome-flower-left .lily-glow')).opacity) > .9"), 'Pollen glows after full growth')
  assert(await evaluate("!document.querySelector('.letter-paper') && !document.querySelector('.envelope')"), 'Letter hidden on welcome')
  await screenshot('welcome-mobile')
  for (const width of [320, 390, 768, 1440]) { await viewport(width); await noOverflow(`Welcome ${width}`) }
  await screenshot('welcome-desktop')
  await viewport(390, 844)
  await click('Begin Our Story')
  assert(await evaluate("document.querySelector('[aria-label=\"Previous photo\"]').disabled"), 'Previous disabled on first photo')
  assert(await evaluate("![...document.querySelectorAll('button')].some(b => b.textContent.includes('Read My Letter'))"), 'No early letter shortcut')
  await waitFor(() => evaluate("document.querySelector('.slide-image')?.naturalWidth > 0"), 'first photo load')
  await screenshot('slideshow-mobile')
  assert(await evaluate("document.activeElement.classList.contains('slideshow')"), 'Focus enters slideshow immediately')
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await pause(150)
  assert(await evaluate("document.querySelector('.slide-position').textContent.startsWith('Photo 2')"), 'Arrow keys advance')
  await screenshot('landscape-mobile')
  await send('Page.reload')
  await waitFor(() => evaluate("document.querySelector('.slide-position')?.textContent.startsWith('Photo 2')"), 'slide restored after refresh')
  await send('Emulation.setTouchEmulationEnabled', { enabled: true })
  const bounds = await evaluate("(() => { const r = document.querySelector('.photo-window').getBoundingClientRect(); return { y: Math.round(r.y + r.height / 2) } })()")
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y: bounds.y }] })
  await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 100, y: bounds.y }] })
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await pause(200)
  assert(await evaluate("document.querySelector('.slide-position').textContent.startsWith('Photo 3')"), 'Touch swipe advances')
  for (let index = 3; index < 7; index++) {
    await evaluate("document.querySelector('[aria-label=\"Next photo\"]').click()")
    await pause(100)
    await waitFor(() => evaluate("document.querySelector('.slide-image')?.naturalWidth > 0"), `photo ${index + 1} loads`)
  }
  assert(await evaluate("document.querySelector('[aria-label=\"Next photo\"]').disabled"), 'Next disabled on final photo')
  await click('Read My Letter')
  assert(await evaluate("Boolean(document.querySelector('.envelope')) && !document.querySelector('.letter-paper')"), 'Envelope before letter')
  await send('Page.reload')
  await waitFor(() => evaluate("Boolean(document.querySelector('.envelope'))"), 'closed envelope survives refresh')
  await screenshot('envelope-mobile')
  await click('Open Your Letter')
  await waitFor(() => evaluate("Boolean(document.querySelector('.letter-paper'))"), 'envelope reveals letter')
  assert(await evaluate("document.activeElement.classList.contains('letter-paper')"), 'Focus moves into letter')
  const expectedLetter = await readFile('src/content/letter.txt', 'utf8')
  if (expectedLetter.trim()) {
    assert.equal(await evaluate("document.querySelector('.letter-text').textContent"), expectedLetter, 'Letter displays the supplied text exactly')
  } else {
    assert(await evaluate("document.querySelector('.letter-placeholder').textContent.includes('Your letter will be placed here.')"), 'Empty letter shows placeholder')
  }
  await waitFor(() => evaluate("document.querySelector('.attached-photo img')?.naturalWidth > 0"), 'attached photo loads')
  await screenshot('letter-mobile')
  for (const width of [320, 390, 768, 1440]) { await viewport(width); await noOverflow(`Letter ${width}`) }
  await screenshot('letter-desktop')
  await send('Page.reload')
  await waitFor(() => evaluate("Boolean(document.querySelector('.letter-paper'))"), 'open letter survives refresh')
  await click('Revisit our memories')
  assert(await evaluate("document.querySelector('.slide-position').textContent.startsWith('Photo 7')"), 'Revisit retains final photo')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  assert(await evaluate("getComputedStyle(document.querySelector('.lily-stems')).animationName === 'none'"), 'Reduced motion disables sway')
  for (const width of [320, 390, 768, 1440]) { await viewport(width); await noOverflow(`Slideshow ${width}`) }
  await screenshot('slideshow-desktop')
  await evaluate("sessionStorage.setItem(Object.keys(sessionStorage)[0], JSON.stringify({screen:'letter', index:900, unlocked:false, opened:true}))")
  await send('Page.reload')
  await waitFor(() => evaluate("Boolean(document.querySelector('#welcome-title'))"), 'invalid letter state is gated')
  assert(await evaluate("getComputedStyle(document.querySelector('.welcome .lily-growth')).animationName === 'none' && getComputedStyle(document.querySelector('.welcome .lily-glow')).animationName === 'none'"), 'Reduced motion disables growth and glow animation')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "Object.defineProperty(window, 'sessionStorage', {get() {throw new Error('Storage unavailable')}})" })
  await send('Page.reload')
  await waitFor(() => evaluate("Boolean(document.querySelector('#welcome-title'))"), 'storage unavailable fallback')
  await click('Begin Our Story')
  assert(await evaluate("Boolean(document.querySelector('.slideshow'))"), 'Works with storage disabled')
  assert.equal(errors.length, 0, `No uncaught browser errors: ${JSON.stringify(errors)}`)
  console.log('PASS: photo loading, sequence gate, keyboard, touch swipe, refresh, envelope, letter focus, revisit, storage fallback, reduced motion, and 320/390/768/1440px overflow checks.')
  console.log('Screenshots saved to .checks/.')
  await send('Browser.close')
} finally {
  socket?.close()
  browser.kill()
  server.kill()
}
