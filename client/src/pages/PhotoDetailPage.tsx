import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { Lightbox } from '../components/Lightbox'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { PhotoResponse } from '../types/api'

/**
 * Single photograph view with series context and lightbox.
 */
export function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, error, loading } = useApi<PhotoResponse>(id ? `/api/photos/${id}` : null)
  const [lightbox, setLightbox] = useState(false)

  const photo = data?.data
  useDocumentTitle(photo ? `${photo.title} — Photoblog` : 'Photograph — Photoblog')

  if (loading) return <StateBlock title="Loading" detail="Opening the frame…" />
  if (error) return <StateBlock title="Not found" detail={error} />
  if (!photo) return <StateBlock title="Not found" detail="This photograph is unavailable." />

  const series = photo.collections?.map((row) => row.collection) ?? []

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
                  <dd>
                    <Link to={`/gallery?category=${photo.category.slug}`} className="hover:text-[var(--color-ink)]">
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
            </dl>

            {series.length > 0 && (
              <div className="pt-4 space-y-2">
                <p className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
                  In collections
                </p>
                <ul className="flex flex-wrap gap-3">
                  {series.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/collections/${c.slug}`}
                        className="text-sm border-b border-[var(--color-border)] hover:border-[var(--color-ink)]"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </figcaption>
        </figure>
      </div>

      <Lightbox
        open={lightbox}
        src={photo.imageUrl}
        alt={photo.altText || photo.title}
        title={photo.title}
        onClose={() => setLightbox(false)}
      />
    </div>
  )
}
