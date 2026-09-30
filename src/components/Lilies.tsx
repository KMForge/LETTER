import { useId } from 'react'

// Original, lightweight vector illustration. Decorative, with no image download.
export function Lilies({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`lilies ${className}`} viewBox="0 0 320 480" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-petal`} x1="-45" y1="-100" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4fbff" /><stop offset=".52" stopColor="#c5e3f6" /><stop offset="1" stopColor="#a5c9e8" />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bacfc1" /><stop offset="1" stopColor="#829f92" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-60%" y="-90%" width="220%" height="280%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <g id={`${id}-anthers`} stroke="none">
          <ellipse cx="-21" cy="-28" rx="2.8" ry="5.5" transform="rotate(-35 -21 -28)" />
          <ellipse cx="9" cy="-31" rx="2.8" ry="5.5" transform="rotate(12 9 -31)" />
          <ellipse cx="34" cy="-21" rx="2.8" ry="5.5" transform="rotate(42 34 -21)" />
          <ellipse cx="-35" cy="-7" rx="5" ry="2.5" /><ellipse cx="43" cy="0" rx="5" ry="2.5" />
        </g>
        <g id={`${id}-flower`} stroke="#91b5d0" strokeWidth=".85" strokeLinejoin="round">
          <path d="M0 9C-24-25-40-58-24-107C6-98 22-60 0 9Z" fill={`url(#${id}-petal)`} />
          <path d="M0 8C22-51 69-80 89-74C76-29 42-1 0 8Z" fill={`url(#${id}-petal)`} />
          <path d="M-1 8C-38 10-81-20-95-51C-52-68-8-22-1 8Z" fill={`url(#${id}-petal)`} />
          <path d="M0 8C-15-19-9-75 31-95C46-49 30-4 0 8Z" fill={`url(#${id}-petal)`} />
          <path d="M0 8C31-20 80-17 110 13C65 38 23 33 0 8Z" fill={`url(#${id}-petal)`} />
          <path d="M0 8C-31 0-65 23-75 68C-32 65-1 42 0 8Z" fill={`url(#${id}-petal)`} />
          <g stroke="#93b9d6" strokeWidth=".6" opacity=".65">
            <path d="M0 7Q-14-56-23-98M0 7Q51-52 81-69M-1 7Q-50-36-85-47M0 7Q19-61 30-86M0 8Q59 10 100 15M0 8Q-45 41-69 61" />
          </g>
          <g stroke="#a995b0" strokeWidth="1.3">
            <path d="M0 10Q-11-11-21-28M0 10Q4-10 9-31M0 10Q19-1 34-21M0 10Q-11-4-35-7M0 10Q21 11 43 0" />
          </g>
          <g fill="#bd9fbb" stroke="none" opacity=".65">
            <circle cx="-9" cy="-9" r="1" /><circle cx="-15" cy="-15" r=".9" /><circle cx="14" cy="-13" r=".8" /><circle cx="22" cy="9" r="1" /><circle cx="-16" cy="20" r=".9" />
          </g>
        </g>
      </defs>
      <g className="lily-stems">
        <g className="lily-growth">
        <path d="M160 470C156 360 123 265 112 170M161 470C198 323 230 255 231 120M163 466C145 377 73 335 57 270" stroke="#8ea99b" strokeWidth="3" />
        <g fill={`url(#${id}-leaf)`} stroke="#8aa697" strokeWidth="1">
          <path d="M151 374C111 365 75 315 78 274C117 296 143 335 151 374Z" />
          <path d="M145 326C181 310 194 272 188 232C160 257 145 292 145 326Z" />
          <path d="M187 365C226 338 262 313 277 265C229 283 202 317 187 365Z" />
          <path d="M210 279C194 254 194 217 207 189C225 217 223 254 210 279Z" />
          <path d="M111 414C87 389 62 379 27 380C49 408 79 422 111 414Z" />
          <path d="M126 256C97 246 76 218 75 197C105 208 119 231 126 256Z" />
        </g>
        <g stroke="#dce8db" strokeWidth=".7"><path d="M151 374Q105 317 78 274M145 326Q168 272 188 232M187 365Q230 314 277 265M210 279L207 189" /></g>
        <g transform="translate(112 177) rotate(-23) scale(.94)">
          <g className="lily-bloom">
            <use href={`#${id}-flower`} />
            <use href={`#${id}-anthers`} fill="#d2a2bb" />
            <g className="lily-glow">
              <use href={`#${id}-anthers`} fill="#ffd4ec" filter={`url(#${id}-glow)`} />
              <use href={`#${id}-anthers`} fill="#fff5fb" />
            </g>
          </g>
        </g>
        <g transform="translate(229 124) rotate(24) scale(.73)">
          <g className="lily-bloom lily-bloom-late">
            <use href={`#${id}-flower`} />
            <use href={`#${id}-anthers`} fill="#d2a2bb" />
            <g className="lily-glow">
              <use href={`#${id}-anthers`} fill="#ffd4ec" filter={`url(#${id}-glow)`} />
              <use href={`#${id}-anthers`} fill="#fff5fb" />
            </g>
          </g>
        </g>
        <g transform="translate(57 270) rotate(-42)">
          <path d="M0 7C-22-13-18-44-5-66C16-49 21-15 0 7Z" fill={`url(#${id}-petal)`} stroke="#91b5d0" />
          <path d="M0 7Q7-24-5-66" stroke="#91b5d0" />
          <path d="M0 12L-11-6L1 1L9-8Z" fill="#8ea99b" />
        </g>
        </g>
      </g>
    </svg>
  )
}
