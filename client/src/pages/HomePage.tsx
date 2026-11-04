import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { IconArrowRight } from '../components/icons/PhotologIcons'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { CollectionsResponse, PhotosResponse, SettingsResponse } from '../types/api'

export function HomePage() {
  useDocumentTitle('Photoblog — Dnyanesh Pise')

  const settings = useApi<SettingsResponse>('/api/settings')
  const featured = useApi<PhotosResponse>('/api/photos?featured=true&limit=6')
  const collections = useApi<CollectionsResponse>('/api/collections')

  if (settings.loading || featured.loading) {
    return <StateBlock title="Loading" detail="Gathering photographs…" loading />
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
  const hero = photos[0]
  const rest = photos.slice(1)

  return (
    <div>
      <section className="pl-page pb-10 md:pb-14">
        <div className="max-w-[72rem] mx-auto">
          <motion.div
            className="max-w-3xl space-y-8"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pl-kicker">{profile?.photographerName ?? 'Photoblog'}</p>
            <h1 className="pl-display text-[clamp(2.4rem,6vw,4.25rem)]">
              {profile?.tagline ?? 'Photographs that hold still for a moment longer.'}
            </h1>
            {profile?.homepageIntro && (
              <p className="pl-lead max-w-xl">{profile.homepageIntro}</p>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/gallery" className="pl-btn">
                View gallery
                <IconArrowRight size={14} />
              </Link>
              <Link to="/collections" className="pl-btn-ghost">
                Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-[72rem] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
            <div className="space-y-2">
              <p className="pl-kicker">01 — Selected</p>
              <h2 className="pl-display text-2xl md:text-3xl">Featured work</h2>
            </div>
            <Link
              to="/gallery"
              className="hidden sm:inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
            >
              All photographs
              <IconArrowRight size={13} />
            </Link>
          </div>

          {photos.length === 0 ? (
            <p className="text-[var(--color-ink-muted)]">No featured photographs yet.</p>
          ) : (
            <div className="space-y-12 md:space-y-16">
              {hero && (
                <PhotoCard photo={hero} emphasis preferLightbox index={0} />
              )}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12 md:gap-y-14">
                  {rest.map((photo, i) => (
                    <PhotoCard key={photo.id} photo={photo} preferLightbox index={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!collections.loading && series.length > 0 && (
        <section className="border-t border-[var(--color-rule)] px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[72rem] mx-auto space-y-12">
            <div className="flex items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="pl-kicker">02 — Series</p>
                <h2 className="pl-display text-2xl md:text-3xl">Collections</h2>
              </div>
              <Link
                to="/collections"
                className="hidden sm:inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
              >
                View all
                <IconArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {series.slice(0, 4).map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/collections/${collection.slug}`} className="pl-photo group block">
                    <div className="pl-photo__frame aspect-[3/2]">
                      {collection.coverPhoto ? (
                        <img
                          src={collection.coverPhoto.thumbnailUrl || collection.coverPhoto.imageUrl}
                          alt={collection.coverPhoto.altText || collection.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-tertiary)] text-sm">
                          No cover
                        </div>
                      )}
                    </div>
                    <div className="pl-photo__meta">
                      <h3 className="pl-photo__title">{collection.title}</h3>
                      <p className="pl-photo__cat">
                        {collection.publishedPhotoCount} photographs
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
