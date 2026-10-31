import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'

/**
 * Application routes.
 * Why: React Router keeps navigation client-side without full page reloads.
 * What: Wraps public pages in SiteLayout; additional routes land in later commits.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        {/* Placeholder routes until gallery / collections pages ship */}
        <Route path="gallery" element={<HomePage />} />
        <Route path="collections" element={<HomePage />} />
        <Route path="about" element={<HomePage />} />
        <Route path="contact" element={<HomePage />} />
      </Route>
    </Routes>
  )
}
