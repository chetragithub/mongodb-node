import { Router } from 'express'
import initServices from './services.js'
export default function initRoutes(tableName, config) {
  const router = new Router()
  const services = initServices(tableName, config)
  // router.get('/schema', services.getSchema)
  router.get('/', services.getAll)
  router.get('/:id', services.getById)
  router.post('/', services.create)
  router.put('/:id', services.update)
  router.delete('/:id', services.destroy)
  return router
}
