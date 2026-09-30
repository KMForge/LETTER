import { useEffect, useRef, type KeyboardEvent, type TouchEvent } from 'react'
import { photos } from '../content/photos'
import { Photo } from '../components/Photo'
import { Lilies } from '../components/Lilies'

type Props = { index: number; onChange: (index: number) => void; onRead: () => void; onBack: () => void }

export function Slideshow({ index, onChange, onRead, onBack }: Props) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const last = index === photos.length - 1
  const photo = photos[index]

  useEffect(() => {
    // Preload only the next photograph; keep the welcome screen lightweight.
    if (photos[index + 1]) { const next = new Image(); next.src = photos[index + 1].src }
  }, [index])

  function move(delta: number) {
    const next = index + delta
    if (next >= 0 && next < photos.length) onChange(next)
  }

  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  function swipe(event: TouchEvent) {
    if (!touchStart.current || !event.changedTouches[0]) return
    const dx = event.changedTouches[0].clientX - touchStart.current.x
    const dy = event.changedTouches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1)
    touchStart.current = null
  }

  return (
    <section className="slideshow screen-enter" aria-labelledby="memories-title" aria-roledescription="carousel" onKeyDown={keyboard} tabIndex={0}>
      <div className="section-heading">
        <p className="eyebrow">chapter one · our memories</p>
        <h1 id="memories-title">Little moments, <em>kept close.</em></h1>
        <p>No rush. Stay here for a while.</p>
      </div>
      {photo ? <>
        <div className="photo-stage" onTouchStart={(event) => {
          const touch = event.touches[0]
          touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
        }} onTouchEnd={swipe} onTouchCancel={() => { touchStart.current = null }}>
          <div className="album-flower"><Lilies /></div>
          <figure className="photo-print" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}>
            <span className="photo-tape" aria-hidden="true" />
            <div className="photo-window"><Photo key={photo.id} photo={photo} eager className="slide-image" /></div>
            <figcaption>{photo.caption || <span className="print-number" aria-hidden="true">{String(index + 1).padStart(2, '0')} <span> / </span> {String(photos.length).padStart(2, '0')}</span>}</figcaption>
          </figure>
        </div>
        <div className="slide-controls">
          <button className="round-button" aria-label="Previous photo" disabled={index === 0} onClick={() => move(-1)}><span aria-hidden="true">←</span></button>
          <p className="slide-position" aria-live="polite" aria-atomic="true">Photo {index + 1} <span>of</span> {photos.length}<span className="sr-only">{photo.caption ? `: ${photo.caption}` : ''}</span></p>
          <button className="round-button" aria-label="Next photo" disabled={last} onClick={() => move(1)}><span aria-hidden="true">→</span></button>
        </div>
        <div className="slide-end">
          {last ? <button className="primary-button" onClick={onRead}>Read My Letter <span aria-hidden="true">↗</span></button>
            : <p className="gentle-note">Swipe, use the arrows, or press ← →</p>}
        </div>
      </> : <p className="empty-state">Your photo collection is waiting to be added.</p>}
      <button className="text-button" onClick={onBack}>← Back to the beginning</button>
    </section>
  )
}
