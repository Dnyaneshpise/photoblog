/** Photolog original icon set — licensed under Photolog / Dnyanesh Pise. */

type IconProps = { size?: number; className?: string }

export function IconArrowLeft({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function IconArrowRight({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function IconClose({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function IconMenu({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function IconExternal({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M9 5H19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

/** Film sprocket mark — Photolog original */
export function IconFilm({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H21M3 16H21M7 4V8M12 4V8M17 4V8M7 16V20M12 16V20M17 16V20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/** Simple aperture glyph — Photolog original */
export function IconAperture({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3L14.5 10H21L16 14.5L18 21L12 17L6 21L8 14.5L3 10H9.5L12 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}
