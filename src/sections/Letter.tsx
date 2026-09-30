import { useEffect, useRef } from 'react'
import { Envelope } from '../components/Envelope'
import { Lilies } from '../components/Lilies'
import { Photo } from '../components/Photo'
import { letterPhoto } from '../content/photos'
import letterText from '../content/letter.txt?raw'

export function Letter({ opened, onOpen, onBack }: { opened: boolean; onOpen: () => void; onBack: () => void }) {
  const paperRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (opened) paperRef.current?.focus({ preventScroll: true })
  }, [opened])

  return (
    <section className="letter-section screen-enter" aria-labelledby="letter-title">
      <div className="section-heading">
        <p className="eyebrow">chapter two · a little letter</p>
        <h1 id="letter-title">A little paper.<br className="mobile-break" /> <em>A lot of heart.</em></h1>
        {!opened && <p>One more thing, just for you.</p>}
      </div>
      {!opened ? <Envelope onOpen={onOpen} /> : (
        <article className="letter-paper" ref={paperRef} tabIndex={-1} aria-label="Your appreciation letter">
          <div className="paper-topline" aria-hidden="true"><span />♡<span /></div>
          <div className="letter-layout">
            <figure className="attached-photo">
              <span className="photo-tape" aria-hidden="true" />
              <a href={letterPhoto.src} target="_blank" rel="noreferrer" aria-label="Open the photo attached to the letter at full size (opens in a new tab)">
                <Photo key={letterPhoto.src} photo={letterPhoto} eager retry={false} />
              </a>
              {letterPhoto.caption && <figcaption>{letterPhoto.caption}</figcaption>}
              <span className="print-heart" aria-hidden="true">♡</span>
            </figure>
            <div className="letter-body">
              {letterText.trim() ? <div className="letter-text">{letterText}</div> : (
                <div className="letter-placeholder"><p className="eyebrow">a letter, soon</p><p>Your letter will be placed here.</p></div>
              )}
            </div>
          </div>
          <div className="letter-flower"><Lilies /></div>
          <div className="paper-end" aria-hidden="true">· &nbsp; ♡ &nbsp; ·</div>
        </article>
      )}
      <button className="text-button revisit" onClick={onBack}>← Revisit our memories</button>
    </section>
  )
}
