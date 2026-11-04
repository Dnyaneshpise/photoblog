import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Photo } from '../types/api'
import { Lightbox } from './Lightbox'

type PhotoCardProps = {
  photo: Photo
  emphasis?: boolean
  preferLightbox?: boolean
  index?: number
}

export function PhotoCard({
  photo,
  emphasis = false,
  preferLightbox = false,
  index = 0,
}: PhotoCardProps) {
  const [open, setOpen] = useState(false)
  const src = photo.thumbnailUrl || photo.imageUrl
  const full = photo.imageUrl
  const alt = photo.altText || photo.title

  const media = (
    <div className={`pl-photo__frame ${emphasis ? 'aspect-[3/2]' : 'aspect-[4/5] sm:aspect-[4/3]'}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )

  return (
    <motion.figure
      className="pl-photo group"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      {preferLightbox ? (
        <button
          type="button"
          className="block w-full text-left cursor-zoom-in"
          onClick={() => setOpen(true)}
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
        {preferLightbox ? (
          <button
            type="button"
            className="pl-photo__title text-left"
            onClick={() => setOpen(true)}
          >
            {photo.title}
          </button>
        ) : (
          <Link to={`/gallery/${photo.id}`} className="pl-photo__title block">
            {photo.title}
          </Link>
        )}
        {photo.category && <p className="pl-photo__cat">{photo.category.name}</p>}
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
