import { Router } from 'express'
import orderService from '../services/orders.js'

export default function initRoutes() {
  const router = new Router()
  // router.get('/schema', services.getSchema)
  router.get('/', orderService.filter)
  router.get('/:id', orderService.getById)
  router.post('/', orderService.create)
  router.put('/:id', orderService.update)
  // router.delete('/:id', orderService.destroy)
  return router
}