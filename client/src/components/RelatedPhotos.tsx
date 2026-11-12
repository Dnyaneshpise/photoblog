import { Link } from 'react-router-dom'
import type { Photo } from '../types/api'

type RelatedPhotosProps = {
  photos: Photo[]
  currentId: string
}

/**
 * Suggests other published frames after viewing a single photograph.
 * Spec: 4–6 related thumbs under photo detail.
 */
export function RelatedPhotos({ photos, currentId }: RelatedPhotosProps) {
  const related = photos.filter((p) => p.id !== currentId).slice(0, 6)
  if (related.length === 0) return null

  return (
    <section className="max-w-[72rem] mx-auto px-6 md:px-12 pb-20 md:pb-28 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="pl-kicker">Related frames</p>
          <h2 className="pl-display text-[clamp(1.5rem,3vw,2rem)]">More from the archive</h2>
        </div>
        <Link
          to="/gallery"
          className="text-[0.68rem] tracking-[0.16em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
        >
          Gallery
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {related.map((photo) => (
          <Link key={photo.id} to={`/gallery/${photo.id}`} className="group block space-y-2">
            <div className="overflow-hidden bg-[var(--color-surface)] aspect-[4/5]">
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText || photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="pl-display text-[0.95rem] leading-snug line-clamp-2">{photo.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
