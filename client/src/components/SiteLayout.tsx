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
 * Public site chrome — premium masthead + footer.
 * © 2026 Dnyanesh Pise / Photolog. All Rights Reserved.
 */
export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const settings = useApi<SettingsResponse>('/api/settings')
  const social = settings.data?.data?.socialLinks ?? null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
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
    ['pl-nav-link', isActive ? 'is-active' : ''].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen flex flex-col relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--color-ink)] focus:text-[var(--color-canvas)] text-xs tracking-[0.14em] uppercase"
      >
        Skip to content
      </a>

      <header className={mastClass}>
        <div className="pl-masthead__bar">
          <Link to="/" className="pl-wordmark">
            Photoblog
          </Link>

          <nav className="pl-masthead__nav" aria-label="Primary">
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
            className={`pl-masthead__menu ${overCover ? 'is-light' : ''}`}
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
              className="pl-masthead__mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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

      <footer className="pl-footer">
        <div className="pl-footer__rule" aria-hidden />
        <div className="pl-footer__inner">
          <div className="pl-footer__brand">
            <span className="pl-footer__mark" aria-hidden />
            <div className="pl-footer__brand-text">
              <Link to="/" className="pl-wordmark pl-footer__title">
                Photoblog
              </Link>
              <p className="pl-footer__tag">Photographs by Dnyanesh Pise</p>
            </div>
          </div>

          <nav className="pl-footer__nav" aria-label="Footer">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="pl-footer__link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pl-footer__meta">
            {social &&
              Object.entries(social).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="pl-footer__link"
                >
                  {label}
                </a>
              ))}
            <p className="pl-footer__copy">
              © {new Date().getFullYear()} Dnyanesh Pise / Photolog. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}
