import { Link } from 'react-router-dom'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import type { PhotosResponse, SettingsResponse } from '../types/api'

/**
 * Editorial homepage.
 * Why: First impression should be photography-led: quiet intro + featured frames.
 * What: Loads portfolio settings and featured published photos from the API.
 */
export function HomePage() {
  const settings = useApi<SettingsResponse>('/api/settings')
  const featured = useApi<PhotosResponse>('/api/photos?featured=true&limit=6')

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

  return (
    <div>
      {/* Hero — type-led, generous space */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-14 md:pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
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
        </div>
      </section>

      {/* Featured work */}
      <section className="px-6 md:px-12 pb-20 md:pb-28">
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
                <PhotoCard key={photo.id} photo={photo} emphasis />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
