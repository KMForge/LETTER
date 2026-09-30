import { useEffect, useRef, useState } from 'react'

export function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  function open() {
    if (opening) return
    setOpening(true)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    timer.current = setTimeout(onOpen, reducedMotion ? 0 : 1200)
  }

  return (
    <div className={`envelope-scene ${opening ? 'is-opening' : ''}`}>
      <div className="envelope" aria-hidden="true">
        <div className="envelope-insert"><span>just for you</span><span>♡</span></div>
        <div className="envelope-pocket" />
        <div className="envelope-flap" />
        <div className="wax-seal">♡</div>
      </div>
      <button className="primary-button" onClick={open} disabled={opening}>{opening ? 'Opening your letter…' : 'Open Your Letter'} <span aria-hidden="true">♡</span></button>
      <p className="gentle-note" role="status">{opening ? 'A little something, unfolding.' : 'Something to unfold. Something to keep.'}</p>
    </div>
  )
}
