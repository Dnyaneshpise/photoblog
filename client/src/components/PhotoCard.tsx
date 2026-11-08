import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Photo } from '../types/api'

type PhotoCardProps = {
  photo: Photo
  emphasis?: boolean
  preferLightbox?: boolean
  index?: number
  aspect?: string
  /** When set with preferLightbox, parent owns the lightbox (gallery nav). */
  onOpenLightbox?: (photo: Photo) => void
}

/**
 * Photograph tile — Photolog original.
 * Curtain reveal on load, viewfinder on hover, optional parent lightbox.
 */
export function PhotoCard({
  photo,
  emphasis = false,
  preferLightbox = false,
  index = 0,
  aspect,
  onOpenLightbox,
}: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false)
  const src = photo.thumbnailUrl || photo.imageUrl
  const alt = photo.altText || photo.title
  const frameAspect = aspect || (emphasis ? 'aspect-[3/2]' : 'aspect-[4/5] sm:aspect-[4/3]')

  function open() {
    if (preferLightbox && onOpenLightbox) onOpenLightbox(photo)
  }

  const media = (
    <div className={`pl-photo__frame ${frameAspect} ${loaded ? 'is-loaded' : ''}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <span className="pl-photo__veil" aria-hidden />
    </div>
  )

  return (
    <motion.figure
      className="pl-photo group"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.06, 0.32),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {preferLightbox && onOpenLightbox ? (
        <button
          type="button"
          className="block w-full text-left cursor-zoom-in"
          onClick={open}
          aria-label={`View ${photo.title}`}
        >
          {media}
        </button>
      ) : (
        <Link to={`/gallery/${photo.id}`} className="block">
          {media}
        </Link>
      )}

      <figcaption className="pl-photo__meta">
        {preferLightbox && onOpenLightbox ? (
          <button type="button" className="pl-photo__title text-left" onClick={open}>
            {photo.title}
          </button>
        ) : (
          <Link to={`/gallery/${photo.id}`} className="pl-photo__title">
            {photo.title}
          </Link>
        )}
        {photo.category && <span className="pl-photo__cat">{photo.category.name}</span>}
      </figcaption>
    </motion.figure>
  )
}
