import { Router } from 'express'
import photosRouter from './photos.js'
import collectionsRouter from './collections.js'
import settingsRouter from './settings.js'
import contactRouter from './contact.js'
import archiveRouter from './archive.js'

const publicRouter = Router()

publicRouter.use(photosRouter)
publicRouter.use(collectionsRouter)
publicRouter.use(settingsRouter)
publicRouter.use(contactRouter)
publicRouter.use(archiveRouter)

export default publicRouter
