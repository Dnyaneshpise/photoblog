import { useCallback, useEffect, useState } from 'react'

type LogoLandingProps = {
  active?: boolean
  onDone?: () => void
  durationMs?: number
  clickToReplay?: boolean
}

const LEAF =
  'M32 9 C33.3 9 35 13 36.1 18.4 C36.9 22.2 36.3 25.2 33.1 27.2 C32.5 27.6 32.2 27.8 32 27.8 C31.8 27.8 31.5 27.6 30.9 27.2 C27.7 25.2 27.1 22.2 27.9 18.4 C29 13 30.7 9 32 9Z'

/**
 * Photoblog logo landing
 * Photo = leaf iris opens. Blog = caption rules draw.
 * © 2026 Dnyanesh Pise / Photoblog. All Rights Reserved.
 */
export function LogoLanding({
  active = true,
  onDone,
  durationMs = 3000,
  clickToReplay = true,
}: LogoLandingProps) {
  const [visible, setVisible] = useState(active)
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    if (!active) return
    setVisible(true)
    const finish = () => {
      setVisible(false)
      onDone?.()
    }
    const t = window.setTimeout(finish, durationMs)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [active, durationMs, onDone, playKey])

  const replay = useCallback(() => {
    if (!clickToReplay) {
      setVisible(false)
      onDone?.()
      return
    }
    setPlayKey((k) => k + 1)
  }, [clickToReplay, onDone])

  if (!visible) return null

  return (
    <div
      className="pl-logo-landing is-play"
      key={playKey}
      role="status"
      aria-label="Photoblog"
      onClick={replay}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          replay()
        }
      }}
      tabIndex={0}
    >
      <svg className="pl-logo-landing__mark" viewBox="0 0 64 64" aria-hidden>
        <path className="pl-logo-landing__tick" d="M11 16 V12.2 Q11 11 12.2 11 H16" />
        <path className="pl-logo-landing__tick" d="M48 11 H51.8 Q53 11 53 12.2 V16" />
        <path className="pl-logo-landing__tick" d="M11 48 V51.8 Q11 53 12.2 53 H16" />
        <path className="pl-logo-landing__tick" d="M48 53 H51.8 Q53 53 53 51.8 V48" />

        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} className="pl-logo-landing__arm" transform={`rotate(${deg} 32 32)`}>
            <path className="pl-logo-landing__petal" d={LEAF} />
          </g>
        ))}

        <circle className="pl-logo-landing__iris" cx="32" cy="32" r="5.2" />
        <circle className="pl-logo-landing__pupil" cx="32" cy="32" r="1.8" />

        <line className="pl-logo-landing__caption pl-logo-landing__caption--long" x1="22" y1="52" x2="42" y2="52" />
        <line className="pl-logo-landing__caption pl-logo-landing__caption--short" x1="26" y1="55" x2="38" y2="55" />
      </svg>
      <p className="pl-logo-landing__word">Photoblog</p>
      <p className="pl-logo-landing__hint">Photo opens · blog writes · click to skip</p>
    </div>
  )
}
