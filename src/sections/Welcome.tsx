import { Lilies } from '../components/Lilies'

export function Welcome({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="welcome screen-enter" aria-labelledby="welcome-title">
      <div className="welcome-flower welcome-flower-left"><Lilies /></div>
      <div className="welcome-copy">
        <p className="eyebrow">a small collection of us</p>
        <div className="tiny-ornament" aria-hidden="true"><span />✧<span /></div>
        <h1 id="welcome-title">For you,<br /><em>with love.</em></h1>
        <p className="welcome-description">A few little moments, gathered together.<br />And a little something waiting at the end.</p>
        <button className="primary-button" onClick={onBegin}>Begin Our Story <span aria-hidden="true">↗</span></button>
        <p className="gentle-note">Take your time. This little corner is yours.</p>
      </div>
      <div className="welcome-flower welcome-flower-right"><Lilies /></div>
      <div className="welcome-bottom" aria-hidden="true"><span />memories, in full bloom<span /></div>
    </section>
  )
}
