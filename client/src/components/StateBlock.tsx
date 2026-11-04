import { ApertureLoader } from './ui/ApertureLoader'

type StateBlockProps = {
  title: string
  detail?: string
  loading?: boolean
}

export function StateBlock({ title, detail, loading = false }: StateBlockProps) {
  return (
    <div className="max-w-md mx-auto px-6 py-28 text-center space-y-6">
      {loading && (
        <div className="flex justify-center">
          <ApertureLoader label={title} />
        </div>
      )}
      <p className="pl-display text-2xl md:text-3xl">{title}</p>
      {detail && <p className="text-[var(--color-ink-secondary)] leading-relaxed">{detail}</p>}
    </div>
  )
}
