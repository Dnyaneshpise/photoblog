import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IconClose, IconMenu } from './icons/PhotologIcons'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const overCover = isHome && !scrolled && !menuOpen
  const mastClass = [
    'pl-masthead',
    overCover ? 'is-over-cover' : 'is-solid',
  ].join(' ')

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'pl-nav-link text-[0.68rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200',
      isActive ? 'is-active text-[var(--color-ink)]' : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]',
    ].join(' ')

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className={mastClass}>
        <div className="max-w-[72rem] mx-auto px-6 md:px-12 h-[4.25rem] md:h-[4.75rem] flex items-center justify-between gap-8">
          <Link to="/" className="pl-wordmark pl-display text-[1.35rem] md:text-[1.5rem] tracking-[0.02em]">
            Photoblog
          </Link>

          <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={'end' in link ? link.end : false}
                className={navClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={`md:hidden flex items-center justify-center p-1.5 -mr-1.5 ${overCover ? 'text-[#f7f5f0]' : 'text-[var(--color-ink)]'}`}
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
              className="md:hidden border-t border-[var(--color-rule)] bg-[var(--color-canvas)]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={'end' in link ? link.end : false}
                    className={navClass}
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
        <div className="max-w-[72rem] mx-auto px-6 md:px-12 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <p className="pl-display text-2xl tracking-[0.02em]">Photoblog</p>
            <p className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)]">
              Photographs by Dnyanesh Pise
            </p>
          </div>
          <p className="text-[0.7rem] tracking-[0.12em] uppercase text-[var(--color-ink-tertiary)]">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
