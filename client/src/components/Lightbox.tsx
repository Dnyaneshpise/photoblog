import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

type LightboxProps = {
  open: boolean
  src: string
  alt: string
  title?: string
  onClose: () => void
}

/**
 * Full-viewport image viewer.
 * Why: Gallery grids stay dense; lightbox gives photographs the space they need.
 * What: Portal + keyboard Escape + click-outside to close; motion for enter/exit.
 */
export function Lightbox({ open, src, alt, title, onClose }: LightboxProps) {
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-xs tracking-[0.16em] uppercase text-white/70 hover:text-white"
          >
            Close
          </button>
          <motion.figure
            className="relative max-w-6xl w-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[82vh] object-contain mx-auto"
            />
            {title && (
              <figcaption
                className="mt-4 text-center text-white/85 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
