import { Link } from 'react-router-dom'
import { useSeoMeta } from '../hooks/useSeoMeta'

/**
 * Branded 404 for unknown public routes.
 */
export function NotFoundPage() {
  useSeoMeta({
    title: 'Not found — Photoblog',
    description: 'This page does not exist on Photoblog.',
  })

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center space-y-6">
      <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">404</p>
      <h1
        className="text-4xl md:text-5xl text-[var(--color-ink)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        This frame is missing
      </h1>
      <p className="text-[var(--color-ink-muted)] max-w-md leading-relaxed">
        The page you requested is not part of the portfolio. Return home or browse the gallery.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link
          to="/"
          className="inline-flex px-7 py-3 text-xs tracking-[0.18em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)]"
        >
          Home
        </Link>
        <Link
          to="/gallery"
          className="inline-flex px-7 py-3 text-xs tracking-[0.18em] uppercase border border-[var(--color-border)]"
        >
          Gallery
        </Link>
      </div>
    </div>
  )
}
