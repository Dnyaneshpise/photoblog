import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import publicRouter from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

/**
 * Creates and configures the Express application.
 * Why: Separates app setup from the HTTP server so tests can import the app without listening.
 * What: Applies security middleware, CORS, JSON parsing, public routes, and error handling.
 */
export function createApp() {
  const app = express()

  // Security headers (helmet) — reduces common browser attack surface.
  app.use(helmet())

  // CORS: allow the Vite dev server and production frontend to call the API with cookies.
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  )

  // Parse JSON bodies and cookies.
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // Health check — used by Render health checks and local verification.
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'photoblog-api', time: new Date().toISOString() })
  })

  // Public read API + contact form (no auth).
  app.use('/api', publicRouter)

  // Unknown API paths → JSON 404 (must run before the error handler).
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Centralized error handler — must be registered last.
  app.use(errorHandler)

  return app
}
