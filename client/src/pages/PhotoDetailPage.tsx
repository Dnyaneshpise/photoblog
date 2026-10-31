import { Link, useParams } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import type { PhotoResponse } from '../types/api'

/**
 * Single photograph view.
 * Why: Give each image room — large presentation with caption and metadata.
 */
export function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, error, loading } = useApi<PhotoResponse>(id ? `/api/photos/${id}` : null)

  if (loading) return <StateBlock title="Loading" detail="Opening the frame…" />
  if (error) return <StateBlock title="Not found" detail={error} />

  const photo = data?.data
  if (!photo) return <StateBlock title="Not found" detail="This photograph is unavailable." />

  return (
    <div className="px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-5xl mx-auto space-y-10">
        <Link
          to="/gallery"
          className="inline-block text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
        >
          ← Gallery
        </Link>

        <figure className="space-y-8">
          <div className="bg-[var(--color-border)]">
            <img
              src={photo.imageUrl}
              alt={photo.altText || photo.title}
              className="w-full max-h-[78vh] object-contain mx-auto"
            />
          </div>
          <figcaption className="max-w-2xl space-y-4">
            <h1
              className="text-3xl md:text-4xl text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {photo.title}
            </h1>
            {photo.description && (
              <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed">
                {photo.description}
              </p>
            )}
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
              {photo.category && (
                <div>
                  <dt className="sr-only">Category</dt>
                  <dd>{photo.category.name}</dd>
                </div>
              )}
              {photo.location && (
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{photo.location}</dd>
                </div>
              )}
            </dl>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
