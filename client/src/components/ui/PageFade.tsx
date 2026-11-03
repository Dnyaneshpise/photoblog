/**
 * PageFade — quiet enter animation for route content.
 * Uses Photolog easing; respects reduced motion via CSS.
 */

import type { ReactNode } from 'react'

type PageFadeProps = {
  children: ReactNode
  className?: string
  delayMs?: number
}

export function PageFade({ children, className = '', delayMs = 0 }: PageFadeProps) {
  return (
    <div
      className={`pl-fade-up ${className}`}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  )
}
