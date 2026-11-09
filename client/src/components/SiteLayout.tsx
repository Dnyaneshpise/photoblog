import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IconClose, IconMenu } from './icons/PhotologIcons'
import { BackToTop } from './BackToTop'
import { ExposureProgress } from './ui/ExposureProgress'
import { useApi } from '../hooks/useApi'
import type { SettingsResponse } from '../types/api'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

/**
 * Public site chrome — masthead, nav, footer with optional social links from API.
 */
export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const settings = useApi<SettingsResponse>('/api/settings')
  const social = settings.data?.data?.socialLinks ?? null

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
  const mastClass = ['pl-masthead', overCover ? 'is-over-cover' : 'is-solid'].join(' ')

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'pl-nav-link text-[0.68rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200',
      isActive
        ? 'is-active text-[var(--color-ink)]'
        : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]',
    ].join(' ')

  return (
    <div className="min-h-screen flex flex-col relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--color-ink)] focus:text-[var(--color-canvas)] text-xs tracking-[0.14em] uppercase"
      >
        Skip to content
      </a>

      <header className={mastClass}>
        <div className="max-w-[72rem] mx-auto px-6 md:px-12 h-[4.25rem] md:h-[4.75rem] flex items-center justify-between gap-8">
          <Link
            to="/"
            className="pl-wordmark pl-display text-[1.35rem] md:text-[1.5rem] tracking-[0.02em]"
          >
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
            className={`md:hidden flex items-center justify-center p-1.5 -mr-1.5 ${
              overCover ? 'text-[#f7f5f0]' : 'text-[var(--color-ink)]'
            }`}
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
              className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-canvas)] px-6 py-6 flex flex-col gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Mobile"
            >
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
            </motion.nav>
          )}
        </AnimatePresence>
        <ExposureProgress />
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="pl-footer mt-auto">
        <div className="pl-footer__inner">
          <div>
            <p className="pl-footer__mark">Photoblog</p>
            <p className="pl-footer__sub">Photographs by Dnyanesh Pise</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {social &&
              Object.entries(social).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {label}
                </a>
              ))}
            <p className="pl-footer__copy">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}
