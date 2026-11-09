import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Aperture return — Photolog original.
 * Circular control; appears after scroll depth.
 */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="pl-aperture-return"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="pl-aperture-return__ring" aria-hidden />
          <span className="pl-aperture-return__label">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
