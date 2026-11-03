/**
 * ImageReveal — soft veil lifts when the image has loaded.
 * Photolog original; keeps photographs from popping harshly.
 */

import { useState } from 'react'

type ImageRevealProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

export function ImageReveal({ src, alt, className = '', imgClassName = '' }: ImageRevealProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`pl-image-reveal ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
