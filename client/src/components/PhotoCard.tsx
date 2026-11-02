import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Photo } from '../types/api'
import { Lightbox } from './Lightbox'

type PhotoCardProps = {
  photo: Photo
  emphasis?: boolean
  /** When true, click opens lightbox instead of navigating to detail */
  preferLightbox?: boolean
}

/**
 * Single photograph tile used on home and gallery.
 * Why: Keep image + caption markup consistent; optional lightbox for quick viewing.
 */
export function PhotoCard({ photo, emphasis = false, preferLightbox = false }: PhotoCardProps) {
  const [open, setOpen] = useState(false)
  const src = photo.thumbnailUrl || photo.imageUrl
  const full = photo.imageUrl
  const alt = photo.altText || photo.title

  const image = (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      className={
        emphasis
          ? 'w-full aspect-[3/2] object-cover'
          : 'w-full aspect-[4/3] object-cover'
      }
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    />
  )

  return (
    <motion.figure
      className="group"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-hidden bg-[var(--color-border)]">
        {preferLightbox ? (
          <button
            type="button"
            className="block w-full text-left cursor-zoom-in"
            onClick={() => setOpen(true)}
            aria-label={`View ${photo.title}`}
          >
            {image}
          </button>
        ) : (
          <Link to={`/gallery/${photo.id}`} className="block">
            {image}
          </Link>
        )}
      </div>
      <figcaption className="mt-3 space-y-1">
        <p className="text-lg text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          {preferLightbox ? (
            <button type="button" className="text-left hover:opacity-70" onClick={() => setOpen(true)}>
              {photo.title}
            </button>
          ) : (
            <Link to={`/gallery/${photo.id}`} className="hover:opacity-70">
              {photo.title}
            </Link>
          )}
        </p>
        {photo.category && (
          <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-ink-subtle)]">
            {photo.category.name}
          </p>
        )}
      </figcaption>

      <Lightbox
        open={open}
        src={full}
        alt={alt}
        title={photo.title}
        onClose={() => setOpen(false)}
      />
    </motion.figure>
  )
}
