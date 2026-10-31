import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiGet, apiPost, ApiError } from '../lib/api'

type AdminUser = {
  id: string
  email: string
  name: string | null
}

type AdminAuthContextValue = {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

/**
 * Holds admin session state for the /admin section.
 * Why: Login status is shared across admin pages without prop drilling.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const result = await apiGet<{ data: AdminUser }>('/api/admin/auth/me')
      setAdmin(result.data)
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiPost<{ data: AdminUser }>('/api/admin/auth/login', {
      email,
      password,
    })
    setAdmin(result.data)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiPost('/api/admin/auth/logout')
    } catch (err) {
      if (!(err instanceof ApiError)) throw err
    }
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({ admin, loading, login, logout, refresh }),
    [admin, loading, login, logout, refresh],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
