/**
 * Photolog icon set — original SVG marks for this product.
 * Not derived from Lucide, Heroicons, or Feather.
 * License: project original (Photolog / Dnyanesh Pise).
 */

import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function frameProps(size: number, props: IconProps) {
  const { size: _s, ...rest } = props
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    ...base,
    ...rest,
  }
}

/** Three staggered lines — menu */
export function IconMenu({ size = 22, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <path d="M4 7h16" />
      <path d="M4 12h12" />
      <path d="M4 17h16" />
    </svg>
  )
}

/** Minimal close */
export function IconClose({ size = 22, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  )
}

export function IconArrowRight({ size = 20, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconArrowLeft({ size = 20, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  )
}

/** External — corner tick unique to Photolog */
export function IconExternal({ size = 18, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <path d="M9 5h10v10" />
      <path d="M19 5L9 15" />
      <path d="M5 9v10h10" />
    </svg>
  )
}

/** Gallery grid — uneven cells, not a standard 2x2 */
export function IconGrid({ size = 20, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <rect x="4" y="4" width="7" height="7" rx="0.5" />
      <rect x="13" y="4" width="7" height="4" rx="0.5" />
      <rect x="13" y="10" width="7" height="10" rx="0.5" />
      <rect x="4" y="13" width="7" height="7" rx="0.5" />
    </svg>
  )
}

/** Frame mark — wordmark companion / brand glyph */
export function IconFrame({ size = 24, ...props }: IconProps) {
  return (
    <svg {...frameProps(size, props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="0.5" />
      <path d="M8 16.5V8h5.5" />
    </svg>
  )
}
