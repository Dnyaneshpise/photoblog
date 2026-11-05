import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { GalleryPage } from './pages/GalleryPage'
import { PhotoDetailPage } from './pages/PhotoDetailPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminPhotosPage } from './pages/admin/AdminPhotosPage'
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage'

/**
 * Public routes under SiteLayout; admin routes unchanged.
 */
export default function App() {
  return (
    <AdminAuthProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/:id" element={<PhotoDetailPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:slug" element={<CollectionDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminPhotosPage />} />
          <Route path="collections" element={<AdminCollectionsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
