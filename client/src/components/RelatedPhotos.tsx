import { Link } from 'react-router-dom'
import type { Photo } from '../types/api'

type RelatedPhotosProps = {
  photos: Photo[]
  currentId: string
}

/**
 * Suggests other published frames after viewing a single photograph.
 */
export function RelatedPhotos({ photos, currentId }: RelatedPhotosProps) {
  const related = photos.filter((p) => p.id !== currentId).slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <h2
          className="text-2xl md:text-3xl text-[var(--color-ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          More from the archive
        </h2>
        <Link
          to="/gallery"
          className="text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
        >
          Gallery
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {related.map((photo) => (
          <Link key={photo.id} to={`/gallery/${photo.id}`} className="group block space-y-3">
            <div className="overflow-hidden bg-[var(--color-border)] aspect-[4/3]">
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText || photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              {photo.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
