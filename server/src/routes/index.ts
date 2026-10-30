import { Router } from 'express'
import photosRouter from './photos.js'
import collectionsRouter from './collections.js'
import settingsRouter from './settings.js'
import contactRouter from './contact.js'

/**
 * Aggregates all public API routers.
 * Why: app.ts stays small; adding a new domain is one import + use() here.
 * What: Mounts photo, collection, settings, and contact routes on a single router.
 */
const publicRouter = Router()

publicRouter.use(photosRouter)
publicRouter.use(collectionsRouter)
publicRouter.use(settingsRouter)
publicRouter.use(contactRouter)

export default publicRouter
