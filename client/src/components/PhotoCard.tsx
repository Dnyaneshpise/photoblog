import { Link } from 'react-router-dom'
import type { Photo } from '../types/api'

type PhotoCardProps = {
  photo: Photo
  /** Optional larger visual weight for featured strips */
  emphasis?: boolean
}

/**
 * Single photograph tile used on home and gallery.
 * Why: Keep image + caption markup consistent and accessible (alt text).
 */
export function PhotoCard({ photo, emphasis = false }: PhotoCardProps) {
  const src = photo.thumbnailUrl || photo.imageUrl
  const alt = photo.altText || photo.title

  return (
    <figure className="group">
      <Link to={`/gallery/${photo.id}`} className="block overflow-hidden bg-[var(--color-border)]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={
            emphasis
              ? 'w-full aspect-[3/2] object-cover transition-transform duration-700 group-hover:scale-[1.02]'
              : 'w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.02]'
          }
        />
      </Link>
      <figcaption className="mt-3 space-y-1">
        <p
          className="text-lg text-[var(--color-ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {photo.title}
        </p>
        {photo.category && (
          <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)]">
            {photo.category.name}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
