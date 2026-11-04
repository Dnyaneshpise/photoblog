import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IconClose, IconMenu } from './icons/PhotologIcons'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-[0.7rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200',
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
      <header className="pl-masthead">
        <div className="max-w-[72rem] mx-auto px-6 md:px-12 h-[4.25rem] md:h-[4.75rem] flex items-center justify-between gap-8">
          <Link
            to="/"
            className="pl-display text-[1.35rem] md:text-[1.5rem] tracking-[0.02em]"
            onClick={() => setMenuOpen(false)}
          >
            Photoblog
          </Link>

          <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
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
            className="md:hidden flex items-center justify-center text-[var(--color-ink)] p-1.5 -mr-1.5"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="md:hidden border-t border-[var(--color-rule)]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
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
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-rule)]">
        <div className="max-w-[72rem] mx-auto px-6 md:px-12 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="pl-display text-lg tracking-[0.02em] text-[var(--color-ink-secondary)]">
            Photoblog
          </p>
          <p className="text-[0.7rem] tracking-[0.12em] uppercase text-[var(--color-ink-tertiary)]">
            © {new Date().getFullYear()} Dnyanesh Pise
          </p>
        </div>
      </footer>
    </div>
  )
}
