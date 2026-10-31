import { Link, NavLink, Outlet } from 'react-router-dom'

/**
 * Site-wide chrome: masthead, navigation, footer.
 * Why: Every public page shares the same editorial frame so content can stay quiet.
 * What: Renders nav links and an <Outlet /> for the active route.
 */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm tracking-[0.14em] uppercase transition-colors',
    isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]',
  ].join(' ')

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-12 py-7 md:py-9 border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="text-2xl md:text-[1.65rem] tracking-[0.04em] text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Photoblog
          </Link>

          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Primary">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/gallery" className={navLinkClass}>
              Gallery
            </NavLink>
            <NavLink to="/collections" className={navLinkClass}>
              Collections
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="px-6 md:px-12 py-8 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-[var(--color-ink-subtle)]">
          <p style={{ fontFamily: 'var(--font-display)' }} className="text-base tracking-wide text-[var(--color-ink-muted)]">
            Photoblog
          </p>
          <p>© {new Date().getFullYear()} · Photographs & site by Dnyanesh Pise</p>
        </div>
      </footer>
    </div>
  )
}
