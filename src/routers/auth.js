import { Router } from 'express'
import authService from '../services/auth.js'
export default function initRoutes(middleware) {
  const router = Router()
  router.post(
    '/register',
    authService.register
  )
  router.post('/login', authService.login)
  router.get('/user', middleware, authService.getUser)
  return router
}
