import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Vite configuration for the Photoblog client.
 * - React plugin: enables JSX/TSX and Fast Refresh.
 * - Tailwind v4 plugin: processes utility classes at build time.
 * - Path alias `@` → `src` so imports stay short and readable.
 * - Dev proxy: forwards /api requests to the Express server so the
 *   frontend can call the backend without CORS friction in development.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api is forwarded to the backend.
      // This keeps the browser origin the same and avoids CORS in local dev.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
