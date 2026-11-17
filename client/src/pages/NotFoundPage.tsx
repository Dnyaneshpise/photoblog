import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { IconArrowRight } from '../components/icons/PhotologIcons'

export function NotFoundPage() {
  useDocumentTitle('Not found — Photoblog')

  return (
    <div className="pl-page">
      <motion.div
        className="pl-404"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pl-404__mark" aria-hidden />
        <p className="pl-kicker">404</p>
        <h1 className="pl-display text-[clamp(2.1rem,5vw,3.1rem)] max-w-md">
          This page is not in the archive.
        </h1>
        <p className="pl-lead max-w-sm mx-auto text-center">
          The frame you asked for may have moved, or the link is incomplete.
        </p>
        <Link to="/" className="pl-btn inline-flex mt-2">
          Return home
          <IconArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  )
}
