import { Router } from 'express'
import productService from '../services/products.js'

export default function initRoutes() {
  const router = new Router()
  // router.get('/schema', services.getSchema)
  router.get('/', productService.getAll)
  router.get('/:id', productService.getById)
  router.post('/', productService.create)
  router.put('/:id', productService.update)
  router.delete('/:id', productService.destroy)
  return router
}