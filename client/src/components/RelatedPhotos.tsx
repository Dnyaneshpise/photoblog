import { Link } from 'react-router-dom'
import type { Photo } from '../types/api'

type RelatedPhotosProps = {
  photos: Photo[]
  currentId: string
}

/**
 * Adjacent frames under photo detail — quiet grid, not a carousel.
 * © 2026 Dnyanesh Pise / Photolog.
 */
export function RelatedPhotos({ photos, currentId }: RelatedPhotosProps) {
  const related = photos.filter((p) => p.id !== currentId).slice(0, 6)
  if (related.length === 0) return null

  return (
    <section className="max-w-[72rem] mx-auto px-6 md:px-12 pb-22 md:pb-28 space-y-9">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="pl-kicker">Related frames</p>
          <h2 className="pl-display text-[clamp(1.55rem,3vw,2.05rem)]">More from the archive</h2>
        </div>
        <Link
          to="/gallery"
          className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
        >
          Gallery
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
        {related.map((photo, i) => (
          <Link key={photo.id} to={`/gallery/${photo.id}`} className="group block space-y-2.5">
            <div className="overflow-hidden bg-[var(--color-surface)] aspect-[4/5]">
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText || photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="pl-display text-[0.95rem] leading-snug line-clamp-2">{photo.title}</p>
              <span className="pl-proof shrink-0" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
