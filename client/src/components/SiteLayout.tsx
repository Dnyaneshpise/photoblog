import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IconClose, IconMenu } from './icons/PhotologIcons'

/**
 * Site-wide chrome: masthead, responsive navigation, footer.
 * Visual language: client/DESIGN.md
 */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm tracking-[0.14em] uppercase transition-colors',
    isActive
      ? 'text-[var(--color-ink)]'
      : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]',
  ].join(' ')

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-12 py-7 md:py-9 border-b border-[var(--color-border)] sticky top-0 z-40 bg-[var(--color-canvas)]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <Link
            to="/"
            className="text-2xl md:text-[1.65rem] tracking-[0.04em] text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
            onClick={() => setMenuOpen(false)}
          >
            Photoblog
          </Link>

          <nav className="hidden md:flex flex-wrap gap-x-8 gap-y-3" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={'end' in link ? link.end : false}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden flex items-center justify-center text-[var(--color-ink)] p-1"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="md:hidden max-w-6xl mx-auto pt-6 flex flex-col gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={'end' in link ? link.end : false}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="px-6 md:px-12 py-8 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-[var(--color-ink-subtle)]">
          <p
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-base tracking-wide text-[var(--color-ink-muted)]"
          >
            Photoblog
          </p>
          <p>© {new Date().getFullYear()} · Photographs & site by Dnyanesh Pise</p>
        </div>
      </footer>
    </div>
  )
}
