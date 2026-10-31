import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-xs tracking-[0.14em] uppercase',
    isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]',
  ].join(' ')

/**
 * Shell for authenticated admin pages.
 * Why: Shared nav + auth gate so individual pages stay focused on content.
 */
export function AdminLayout() {
  const { admin, loading, logout } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-ink-muted)]">
        Checking session…
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
      <header className="border-b border-[var(--color-border)] px-6 md:px-10 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              Photoblog Admin
            </Link>
            <nav className="flex flex-wrap gap-5">
              <NavLink to="/admin" end className={linkClass}>
                Photos
              </NavLink>
              <NavLink to="/admin/collections" className={linkClass}>
                Collections
              </NavLink>
              <NavLink to="/admin/settings" className={linkClass}>
                Settings
              </NavLink>
              <NavLink to="/admin/messages" className={linkClass}>
                Messages
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--color-ink-muted)]">
            <span>{admin.email}</span>
            <Link to="/" className="text-xs tracking-[0.12em] uppercase hover:text-[var(--color-ink)]">
              View site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-xs tracking-[0.12em] uppercase hover:text-[var(--color-ink)]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
