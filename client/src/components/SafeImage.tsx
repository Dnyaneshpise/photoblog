import { useState } from 'react'

type SafeImageProps = {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Image with a quiet fallback when a remote URL fails (broken CDN / demo link).
 * Why: Demo and third-party URLs should not leave empty grey holes in the layout.
 */
export function SafeImage({ src, alt, className, loading = 'lazy' }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={[
          'flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-ink-tertiary)] text-[0.62rem] tracking-[0.14em] uppercase',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        Frame unavailable
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
