import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { CollectionsResponse, PhotosResponse, SettingsResponse } from '../types/api'

/**
 * Editorial homepage — intro, featured frames, and published collections.
 */
export function HomePage() {
  useDocumentTitle('Photoblog — Dnyanesh Pise')

  const settings = useApi<SettingsResponse>('/api/settings')
  const featured = useApi<PhotosResponse>('/api/photos?featured=true&limit=6')
  const collections = useApi<CollectionsResponse>('/api/collections')

  if (settings.loading || featured.loading) {
    return <StateBlock title="Loading" detail="Gathering photographs…" />
  }

  if (settings.error || featured.error) {
    return (
      <StateBlock
        title="Unable to load"
        detail={settings.error || featured.error || 'Please try again shortly.'}
      />
    )
  }

  const profile = settings.data?.data
  const photos = featured.data?.data ?? []
  const series = collections.data?.data ?? []

  return (
    <div>
      <section className="px-6 md:px-12 pt-16 md:pt-28 pb-14 md:pb-20">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">
            {profile?.photographerName ?? 'Photoblog'}
          </p>
          <h1
            className="text-4xl md:text-6xl leading-[1.08] text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {profile?.tagline ?? 'Photographs that hold still for a moment longer.'}
          </h1>
          {profile?.homepageIntro && (
            <p className="text-lg md:text-xl text-[var(--color-ink-muted)] leading-relaxed max-w-2xl mx-auto">
              {profile.homepageIntro}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/gallery"
              className="inline-flex items-center px-7 py-3 text-xs tracking-[0.18em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] hover:opacity-90 transition-opacity"
            >
              View gallery
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center px-7 py-3 text-xs tracking-[0.18em] uppercase border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
            >
              Collections
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2
              className="text-2xl md:text-3xl text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Selected work
            </h2>
            <Link
              to="/gallery"
              className="text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
            >
              All photographs
            </Link>
          </div>

          {photos.length === 0 ? (
            <p className="text-[var(--color-ink-muted)]">No featured photographs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} emphasis preferLightbox />
              ))}
            </div>
          )}
        </div>
      </section>

      {!collections.loading && series.length > 0 && (
        <section className="px-6 md:px-12 pb-20 md:pb-28 border-t border-[var(--color-border)] pt-16">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex items-end justify-between gap-4">
              <h2
                className="text-2xl md:text-3xl text-[var(--color-ink)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Collections
              </h2>
              <Link
                to="/collections"
                className="text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {series.slice(0, 4).map((collection) => (
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
                  <div>
                    <h3
                      className="text-2xl text-[var(--color-ink)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {collection.title}
                    </h3>
                    <p className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)] mt-1">
                      {collection.publishedPhotoCount} photographs
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
