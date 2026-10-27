import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'

/**
 * Creates and configures the Express application.
 * Why: Separates app setup from the HTTP server so tests can import the app without listening.
 * What: Applies security middleware, CORS, JSON parsing, and mounts route modules.
 */
export function createApp() {
  const app = express()

  // Security headers (helmet) — reduces common browser attack surface.
  app.use(helmet())

  // CORS: allow the Vite dev server (and later the production frontend) to call the API.
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true, // required for cookie-based sessions
    }),
  )

  // Parse JSON bodies and cookies.
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // Health check — used by Docker/load balancers and local verification.
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'photoblog-api', time: new Date().toISOString() })
  })

  // Placeholder for future routes (photos, collections, auth, admin).
  // Day 3+ will mount real routers here.

  // Centralized 404 for unknown API paths.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}
