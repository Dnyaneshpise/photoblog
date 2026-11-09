import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { Lightbox } from '../components/Lightbox'
import { RelatedPhotos } from '../components/RelatedPhotos'
import { ShareButton } from '../components/ShareButton'
import { useApi } from '../hooks/useApi'
import { useSeoMeta } from '../hooks/useSeoMeta'
import type { PhotoResponse, PhotosResponse } from '../types/api'

/**
 * Single photograph with lightbox, share, series links, and related work.
 */
export function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, error, loading } = useApi<PhotoResponse>(id ? `/api/photos/${id}` : null)
  const relatedQuery = useApi<PhotosResponse>('/api/photos?limit=6')
  const [lightbox, setLightbox] = useState(false)

  const photo = data?.data

  useSeoMeta({
    title: photo ? `${photo.title} — Photoblog` : 'Photograph — Photoblog',
    description: photo?.description || photo?.altText || undefined,
    image: photo?.imageUrl,
    type: 'article',
  })

  if (loading) return <StateBlock title="Loading" detail="Opening the frame…" />
  if (error) return <StateBlock title="Not found" detail={error} />
  if (!photo) return <StateBlock title="Not found" detail="This photograph is unavailable." />

  const series = photo.collections?.map((row) => row.collection) ?? []

  return (
    <>
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/gallery"
              className="inline-block text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
            >
              ← Gallery
            </Link>
            <ShareButton title={photo.title} />
          </div>

          <figure className="space-y-8">
            <button
              type="button"
              className="block w-full bg-[var(--color-border)] cursor-zoom-in"
              onClick={() => setLightbox(true)}
              aria-label={`Enlarge ${photo.title}`}
            >
              <img
                src={photo.imageUrl}
                alt={photo.altText || photo.title}
                className="w-full max-h-[78vh] object-contain mx-auto"
              />
            </button>
            <figcaption className="pl-film-edge">
              <div className="pl-film-edge__ticks" aria-hidden>
                <span /><span /><span /><span /><span />
              </div>
              <div className="space-y-3 min-w-0">
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
                      <dd>
                        <Link
                          to={`/gallery?category=${photo.category.slug}`}
                          className="hover:text-[var(--color-ink)]"
                        >
                          {photo.category.name}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {photo.location && (
                    <div>
                      <dt className="sr-only">Location</dt>
                      <dd>{photo.location}</dd>
                    </div>
                  )}
                  {photo.takenAt && (
                    <div>
                      <dt className="sr-only">Date</dt>
                      <dd>{new Date(photo.takenAt).getFullYear()}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="pl-film-edge__ticks" aria-hidden>
                <span /><span /><span /><span /><span />
              </div>
            </figcaption>
          </figure>
        </div>
      </div>

      {!relatedQuery.loading && relatedQuery.data && (
        <RelatedPhotos photos={relatedQuery.data.data} currentId={photo.id} />
      )}

      <Lightbox
        open={lightbox}
        src={photo.imageUrl}
        alt={photo.altText || photo.title}
        title={photo.title}
        onClose={() => setLightbox(false)}
      />
    </>
  )
}
