import { Link } from 'react-router-dom'
import { OpticalRule } from '../components/ui/OpticalRule'
import { motion } from 'framer-motion'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { IconArrowRight } from '../components/icons/PhotologIcons'
import { useApi } from '../hooks/useApi'
import { useSeoMeta } from '../hooks/useSeoMeta'
import type { CollectionsResponse, PhotosResponse, SettingsResponse } from '../types/api'

/**
 * Editorial home — cover, filmstrip, bento, collections teaser, quiet close.
 */
export function HomePage() {
  const settings = useApi<SettingsResponse>('/api/settings')
  const featured = useApi<PhotosResponse>('/api/photos?featured=true&limit=8')
  const collections = useApi<CollectionsResponse>('/api/collections')

  const profile = settings.data?.data
  const photos = featured.data?.data ?? []
  const series = collections.data?.data ?? []
  const cover = photos[0]
  const strip = photos.slice(0, 6)
  const bento = photos.slice(1, 4)

  useSeoMeta({
    title: profile
      ? `${profile.photographerName} — Photoblog`
      : 'Photoblog — Dnyanesh Pise',
    description:
      profile?.homepageIntro ||
      profile?.tagline ||
      'A photography portfolio — light, quiet streets, and frames that hold still.',
    image: cover?.imageUrl,
  })

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

  return (
    <div>
      <section className="pl-cover is-live">
        <div className="pl-cover__media" aria-hidden={!cover}>
          {cover ? (
            <img src={cover.imageUrl || cover.thumbnailUrl || ''} alt="" />
          ) : (
            <div className="w-full h-full bg-[var(--color-night)]" />
          )}
        </div>
        <div className="pl-cover__veil" />
        <div className="pl-cover__content">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="pl-cover__kicker">{profile?.photographerName ?? 'Photoblog'}</p>
            <h1 className="pl-cover__title">
              {profile?.tagline ?? 'Photographs that hold still for a moment longer.'}
            </h1>
            {profile?.homepageIntro && (
              <p className="pl-cover__lead">{profile.homepageIntro}</p>
            )}
            <div className="pl-cover__actions">
              <Link to="/gallery" className="pl-btn">
                Enter gallery
                <IconArrowRight size={14} />
              </Link>
              <Link to="/collections" className="pl-btn-ghost">
                Collections
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="pl-cover__scroll" aria-hidden>
          <span>Scroll</span>
          <span className="pl-cover__scroll-line" />
        </div>
      </section>

      <div className="max-w-[72rem] mx-auto px-6 md:px-12">
        <OpticalRule />
      </div>

      {strip.length > 0 && (
        <section className="px-6 md:px-12 py-18 md:py-28">
          <div className="max-w-[72rem] mx-auto space-y-9">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="pl-kicker">Frames</p>
                <h2 className="pl-display text-[1.75rem] md:text-[2.15rem]">Recent selections</h2>
              </div>
              <Link
                to="/gallery"
                className="hidden sm:inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
              >
                All work
                <IconArrowRight size={13} />
              </Link>
            </div>
            <div className="pl-strip">
              {strip.map((photo, i) => (
                <PhotoCard key={photo.id} photo={photo} index={i} aspect="aspect-[3/4]" />
              ))}
            </div>
          </div>
        </section>
      )}

      {bento.length > 0 && (
        <section className="px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-[72rem] mx-auto space-y-10">
            <div className="space-y-2">
              <p className="pl-kicker">Featured</p>
              <h2 className="pl-display text-[1.75rem] md:text-[2.15rem]">In focus</h2>
            </div>
            <div className="pl-bento">
              {bento.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  emphasis={i === 0}
                  aspect={
                    i === 0
                      ? 'aspect-[3/4] md:aspect-auto md:h-full md:min-h-[32rem]'
                      : 'aspect-[4/3]'
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {!collections.loading && series.length > 0 && (
        <section className="border-t border-[var(--color-rule)] px-6 md:px-12 py-18 md:py-28">
          <div className="max-w-[72rem] mx-auto space-y-12">
            <div className="flex items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="pl-kicker">Series</p>
                <h2 className="pl-display text-[1.75rem] md:text-[2.15rem]">Collections</h2>
              </div>
              <Link
                to="/collections"
                className="hidden sm:inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
              >
                View all
                <IconArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {series.slice(0, 4).map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/collections/${collection.slug}`} className="pl-plate group">
                    <div className="pl-plate__frame aspect-[3/2]">
                      <span className="pl-plate__index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="pl-plate__inset" aria-hidden />
                      {collection.coverPhoto ? (
                        <img
                          src={
                            collection.coverPhoto.thumbnailUrl || collection.coverPhoto.imageUrl
                          }
                          alt={collection.coverPhoto.altText || collection.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-tertiary)] text-sm">
                          No cover
                        </div>
                      )}
                    </div>
                    <div className="pl-plate__meta">
                      <h3 className="pl-plate__title">{collection.title}</h3>
                      <p className="pl-plate__count">
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

      <section className="border-t border-[var(--color-rule)] px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-[72rem] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="pl-display text-[clamp(1.35rem,3vw,1.85rem)] max-w-md text-[var(--color-ink)]">
            The archive is open — walk the full set at your own pace.
          </p>
          <Link to="/gallery" className="pl-btn self-start">
            Enter gallery
            <IconArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
