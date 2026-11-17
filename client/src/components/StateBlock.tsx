import { ApertureLoader } from './ui/ApertureLoader'

type StateBlockProps = {
  title: string
  detail?: string
  loading?: boolean
}

/**
 * Quiet empty / loading / error state — Photolog.
 */
export function StateBlock({ title, detail, loading = false }: StateBlockProps) {
  return (
    <div className="pl-empty">
      {loading ? (
        <div className="flex justify-center mb-2">
          <ApertureLoader label={title} />
        </div>
      ) : (
        <div className="pl-empty__mark" aria-hidden />
      )}
      <p className="pl-empty__title">{title}</p>
      {detail && <p className="pl-empty__body">{detail}</p>}
    </div>
  )
}
