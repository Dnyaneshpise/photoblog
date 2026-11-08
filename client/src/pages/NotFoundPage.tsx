import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { IconArrowRight } from '../components/icons/PhotologIcons'

export function NotFoundPage() {
  useDocumentTitle('Not found — Photoblog')

  return (
    <div className="pl-page">
      <motion.div
        className="max-w-xl mx-auto space-y-8 py-16 md:py-24"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="pl-kicker">404</p>
        <h1 className="pl-display text-[clamp(2.2rem,5vw,3.25rem)]">This page is not in the archive.</h1>
        <p className="pl-lead">
          The frame you asked for may have moved, or the link is incomplete.
        </p>
        <Link to="/" className="pl-btn inline-flex">
          Return home
          <IconArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  )
}
