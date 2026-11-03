/**
 * ApertureLoader — Photolog original loading mark.
 * Eight blades around a ring; staggered opacity pulse.
 * Not a generic spinner.
 */

type ApertureLoaderProps = {
  label?: string
  className?: string
}

export function ApertureLoader({ label = 'Loading', className = '' }: ApertureLoaderProps) {
  return (
    <div
      className={`inline-flex flex-col items-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="pl-aperture" aria-hidden>
        <div className="pl-aperture__ring" />
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="pl-aperture__blade" />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
