import { useEffect, useRef, useState } from 'react'
import { Lilies } from './components/Lilies'
import { photos } from './content/photos'
import { Welcome } from './sections/Welcome'
import { Slideshow } from './sections/Slideshow'
import { Letter } from './sections/Letter'
import './styles/experience.css'

type Screen = 'welcome' | 'slideshow' | 'letter'
type Progress = { screen: Screen; index: number; unlocked: boolean; opened: boolean }
const storageKey = `lily-letter:v1:${photos.map((photo) => photo.id).join(',')}`
const initialProgress: Progress = { screen: 'welcome', index: 0, unlocked: false, opened: false }

function restoreProgress(): Progress {
  try {
    const saved: Partial<Progress> = JSON.parse(sessionStorage.getItem(storageKey) || 'null') || {}
    const index = Number.isInteger(saved.index)
      ? Math.max(0, Math.min(saved.index!, photos.length - 1)) : 0
    const unlocked = saved.unlocked === true && photos.length > 0
    const screen = saved.screen === 'slideshow' || (saved.screen === 'letter' && unlocked)
      ? saved.screen : 'welcome'
    return { screen, index, unlocked, opened: unlocked && saved.opened === true }
  } catch {
    return initialProgress
  }
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(restoreProgress)
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(progress)) } catch { /* Storage is optional. */ }
  }, [progress])

  useEffect(() => {
    document.title = `${progress.screen === 'welcome' ? 'For you' : progress.screen === 'slideshow' ? 'Our memories' : 'A letter for you'} · Lily Letter`
    if (firstRender.current) { firstRender.current = false; return }
    window.scrollTo({ top: 0, behavior: 'instant' })
    const focusTarget = mainRef.current?.querySelector<HTMLElement>('.slideshow') || mainRef.current
    focusTarget?.focus({ preventScroll: true })
  }, [progress.screen])

  function goTo(screen: Screen) {
    setProgress((current) => screen === 'letter' && !current.unlocked
      ? current : { ...current, screen })
  }

  function changeSlide(index: number) {
    setProgress((current) => ({
      ...current,
      index,
      unlocked: current.unlocked || index === photos.length - 1,
    }))
  }

  function begin() {
    setProgress((current) => ({
      ...current, screen: 'slideshow',
      unlocked: current.unlocked || photos.length === 1,
    }))
  }

  const step = progress.screen === 'welcome' ? 0 : progress.screen === 'slideshow' ? 1 : 2

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <button className="wordmark" onClick={() => goTo('welcome')} aria-label="Lily Letter — return to welcome">
          <span className="brand-flower" aria-hidden="true">✳</span> lily letter<span className="wordmark-dot">.</span>
        </button>
        <span className="header-note">a little keepsake, just for you</span>
      </header>

      <nav className="journey" aria-label="Our story progress">
        <ol>
          {['The beginning', 'Our memories', 'A little letter'].map((label, index) => (
            <li key={label} className={index <= step ? 'is-current-or-past' : ''} aria-current={index === step ? 'step' : undefined}>
              <span className="step-number">0{index + 1}</span><span>{label}</span>
            </li>
          ))}
        </ol>
      </nav>

      <main id="main" ref={mainRef} tabIndex={-1}>
        {progress.screen === 'welcome' && <Welcome onBegin={begin} />}
        {progress.screen === 'slideshow' && <Slideshow index={progress.index} onChange={changeSlide} onRead={() => goTo('letter')} onBack={() => goTo('welcome')} />}
        {progress.screen === 'letter' && <Letter opened={progress.opened} onOpen={() => setProgress((current) => ({ ...current, opened: true }))} onBack={() => goTo('slideshow')} />}
      </main>

      <footer className="site-footer"><span aria-hidden="true">✧</span> a few moments. a little paper. something to keep. <span aria-hidden="true">✧</span></footer>
      <div className="corner-botanical" aria-hidden="true"><Lilies /></div>
    </div>
  )
}
