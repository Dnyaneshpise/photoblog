/**
 * Loading / error / empty panels — quiet, with optional ApertureLoader.
 */

import { ApertureLoader } from './ui/ApertureLoader'

type StateBlockProps = {
  title: string
  detail?: string
  loading?: boolean
}

export function StateBlock({ title, detail, loading = false }: StateBlockProps) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-5">
      {loading && (
        <div className="flex justify-center">
          <ApertureLoader label={title} />
        </div>
      )}
      <p
        className="text-2xl text-[var(--color-ink)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </p>
      {detail && (
        <p className="text-[var(--color-ink-muted)] leading-relaxed">{detail}</p>
      )}
    </div>
  )
}
