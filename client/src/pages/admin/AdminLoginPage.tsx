import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { useAdminAuth } from '../../context/AdminAuthContext'

/**
 * Admin sign-in form.
 * Why: Protects the dashboard; session is stored in an httpOnly cookie by the API.
 */
export function AdminLoginPage() {
  const { admin, loading, login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && admin) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-ink)]'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-canvas)]">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-ink-subtle)]">Admin</p>
          <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
            Sign in
          </h1>
        </div>

        <div className="space-y-2">
          <label className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-xs tracking-[0.18em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
