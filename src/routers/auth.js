import { Router } from 'express'
import { check } from 'express-validator'
import authService from '../services/auth.js'
import ensureFields from '../validations/ensure-fields.js'
export default function initRoutes(middleware) {
  const router = Router()
  router.post(
    '/register',
    // [
    //   check('email').isEmail(),
    //   check('password').notEmpty(),
    //   check('first_name').notEmpty(),
    //   check('last_name').notEmpty(),
    // ],
    // ensureFields,
    authService.register
  )
  router.post('/login', authService.login)
  router.get('/user', middleware, authService.getUser)
  return router
}
