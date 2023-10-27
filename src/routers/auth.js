import { Router } from 'express'
import authService from '../services/auth.js'
export default function initRoutes(middleware) {
  const router = Router()
  router.post('/register', middleware, authService.register)
  router.post('/login', authService.login)
  router.get('/user', middleware, authService.mySelf)
  router.get('/staff', middleware, authService.getStaff)
  router.put('/staff/:id', middleware, authService.updateStaff)
  router.delete('/staff/:id', middleware, authService.deleteStaff)
  return router
}
