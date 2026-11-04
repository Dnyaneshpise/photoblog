import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { Lightbox } from '../components/Lightbox'
import { IconArrowLeft } from '../components/icons/PhotologIcons'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { PhotoResponse } from '../types/api'

export function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, error, loading } = useApi<PhotoResponse>(id ? `/api/photos/${id}` : null)
  const [lightbox, setLightbox] = useState(false)

  const photo = data?.data
  useDocumentTitle(photo ? `${photo.title} — Photoblog` : 'Photograph — Photoblog')

  if (loading) return <StateBlock title="Loading" detail="Opening the frame…" loading />
  if (error) return <StateBlock title="Not found" detail={error} />
  if (!photo) return <StateBlock title="Not found" detail="This photograph is unavailable." />

  const series = photo.collections?.map((row) => row.collection) ?? []

  return (
    <div className="pl-page">
      <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
        >
          <IconArrowLeft size={13} />
          Gallery
        </Link>

        <figure className="space-y-10">
          <button
            type="button"
            className="block w-full bg-[var(--color-rule)] cursor-zoom-in"
            onClick={() => setLightbox(true)}
            aria-label={`Enlarge ${photo.title}`}
          >
            <img
              src={photo.imageUrl}
              alt={photo.altText || photo.title}
              className="w-full max-h-[78vh] object-contain mx-auto"
            />
          </button>
          <figcaption className="max-w-2xl space-y-5">
            <h1 className="pl-display text-3xl md:text-4xl">{photo.title}</h1>
            {photo.description && (
              <p className="pl-lead">{photo.description}</p>
            )}
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-[0.65rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)]">
              {photo.category && (
                <div>
                  <dt className="sr-only">Category</dt>
                  <dd>
                    <Link
                      to={`/gallery?category=${photo.category.slug}`}
                      className="hover:text-[var(--color-ink)] transition-colors"
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
            </dl>

            {series.length > 0 && (
              <div className="pt-6 border-t border-[var(--color-rule)] space-y-3">
                <p className="pl-kicker">In collections</p>
                <ul className="flex flex-wrap gap-4">
                  {series.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/collections/${c.slug}`}
                        className="text-sm border-b border-[var(--color-rule)] hover:border-[var(--color-ink)] pb-0.5 transition-colors"
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
