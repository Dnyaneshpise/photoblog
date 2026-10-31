/**
 * Simple loading / error / empty panels so pages stay uncluttered.
 */

type StateBlockProps = {
  title: string
  detail?: string
}

export function StateBlock({ title, detail }: StateBlockProps) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-3">
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
