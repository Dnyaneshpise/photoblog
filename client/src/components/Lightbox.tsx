import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrowLeft, IconArrowRight, IconClose } from './icons/PhotologIcons'

type LightboxProps = {
  open: boolean
  src: string
  alt: string
  title?: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  index?: number
  total?: number
}

/**
 * Cinematic full-viewport viewer — Photolog original.
 * © 2026 Dnyanesh Pise / Photolog. All Rights Reserved.
 */
export function Lightbox({
  open,
  src,
  alt,
  title,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: LightboxProps) {
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev?.()
      if (event.key === 'ArrowRight') onNext?.()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, onPrev, onNext])

  if (typeof document === 'undefined') return null

  const showNav = Boolean(onPrev || onNext)
  const counter =
    typeof index === 'number' && typeof total === 'number' && total > 0
      ? `${String(index + 1).padStart(2, '0')} — ${String(total).padStart(2, '0')}`
      : null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="pl-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="pl-lightbox__close"
            aria-label="Close"
          >
            <IconClose size={22} />
          </button>

          {showNav && (
            <>
              <button
                type="button"
                className="pl-lightbox__nav pl-lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev?.()
                }}
                aria-label="Previous photograph"
                disabled={!onPrev}
              >
                <IconArrowLeft size={26} />
              </button>
              <button
                type="button"
                className="pl-lightbox__nav pl-lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext?.()
                }}
                aria-label="Next photograph"
                disabled={!onNext}
              >
                <IconArrowRight size={26} />
              </button>
            </>
          )}

          <motion.figure
            className="pl-lightbox__figure"
            key={src}
            initial={{ opacity: 0, scale: 0.985, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: 6 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={src} alt={alt} className="pl-lightbox__img" />
            <figcaption className="pl-lightbox__cap">
              {title && <p className="pl-lightbox__title">{title}</p>}
              {counter && <p className="pl-lb-counter">{counter}</p>}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
