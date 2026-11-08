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
 * Cinematic full-viewport viewer — Photolog original motion.
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0b0a]/96 p-5 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 text-[#f2f0eb]/55 hover:text-[#f2f0eb] transition-colors p-2 z-10"
            aria-label="Close"
          >
            <IconClose size={22} />
          </button>

          {showNav && (
            <>
              <button
                type="button"
                className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-[#f2f0eb]/55 hover:text-[#f2f0eb] p-2 disabled:opacity-25 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev?.()
                }}
                aria-label="Previous photograph"
                disabled={!onPrev}
              >
                <IconArrowLeft size={28} />
              </button>
              <button
                type="button"
                className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-[#f2f0eb]/55 hover:text-[#f2f0eb] p-2 disabled:opacity-25 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext?.()
                }}
                aria-label="Next photograph"
                disabled={!onNext}
              >
                <IconArrowRight size={28} />
              </button>
            </>
          )}

          <motion.figure
            className="relative max-w-6xl w-full"
            key={src}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: 6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[78vh] object-contain mx-auto"
            />
            <figcaption className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 px-1">
              {title && (
                <p
                  className="text-[#f2f0eb]/88 text-lg md:text-xl tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </p>
              )}
              {counter && <p className="pl-lb-counter">{counter}</p>}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
