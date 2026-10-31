import { Link, useParams } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import type { CollectionDetailResponse } from '../types/api'

/**
 * Single collection with ordered photographs.
 */
export function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, error, loading } = useApi<CollectionDetailResponse>(
    slug ? `/api/collections/${slug}` : null,
  )

  if (loading) return <StateBlock title="Loading" detail="Opening the series…" />
  if (error) return <StateBlock title="Not found" detail={error} />

  const collection = data?.data
  if (!collection) return <StateBlock title="Not found" detail="This collection is unavailable." />

  return (
    <div className="px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-6 max-w-2xl">
          <Link
            to="/collections"
            className="inline-block text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
          >
            ← Collections
          </Link>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {collection.photos.map((photo) => (
            <figure key={photo.id} className="group">
              <Link to={`/gallery/${photo.id}`} className="block overflow-hidden bg-[var(--color-border)]">
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.altText || photo.title}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </Link>
              <figcaption className="mt-3">
                <p className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {photo.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
