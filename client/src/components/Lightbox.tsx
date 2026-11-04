import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose } from './icons/PhotologIcons'

type LightboxProps = {
  open: boolean
  src: string
  alt: string
  title?: string
  onClose: () => void
}

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0b0a]/94 p-5 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 text-[#f2f0eb]/70 hover:text-[#f2f0eb] transition-colors p-2"
            aria-label="Close"
          >
            <IconClose size={22} />
          </button>
          <motion.figure
            className="relative max-w-6xl w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[80vh] object-contain mx-auto"
            />
            {title && (
              <figcaption
                className="mt-5 text-center text-[#f2f0eb]/80 text-lg tracking-[-0.02em]"
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
