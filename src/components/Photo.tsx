import { useState } from 'react'
import type { StoryPhoto } from '../content/photos'

export function Photo({ photo, className = '', eager = false, retry = true }: { photo: StoryPhoto; className?: string; eager?: boolean; retry?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <div className={`photo-unavailable ${className}`} role="img" aria-label={photo.alt}>
      <span aria-hidden="true">♡</span><p>This photo couldn’t load.</p>
      {retry && <button className="text-button" onClick={() => setFailed(false)}>Try again</button>}
    </div>
  ) : (
    <img className={className} src={photo.src} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} draggable={false} />
  )
}
