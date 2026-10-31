import { Link } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import type { CollectionsResponse } from '../types/api'

/**
 * Published collections index.
 * Why: Series are how the portfolio is structured beyond a flat grid.
 */
export function CollectionsPage() {
  const { data, error, loading } = useApi<CollectionsResponse>('/api/collections')

  if (loading) return <StateBlock title="Loading" detail="Opening collections…" />
  if (error) return <StateBlock title="Unable to load" detail={error} />

  const collections = data?.data ?? []

  return (
    <div className="px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="max-w-2xl space-y-4">
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">
            Collections
          </p>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Bodies of work
          </h1>
        </header>

        {collections.length === 0 ? (
          <StateBlock title="No collections" detail="Published series will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group block space-y-4"
              >
                <div className="overflow-hidden bg-[var(--color-border)] aspect-[3/2]">
                  {collection.coverPhoto ? (
                    <img
                      src={collection.coverPhoto.thumbnailUrl || collection.coverPhoto.imageUrl}
                      alt={collection.coverPhoto.altText || collection.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-subtle)] text-sm">
                      No cover
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h2
                    className="text-2xl text-[var(--color-ink)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <p className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
                    {collection.publishedPhotoCount} photographs
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
