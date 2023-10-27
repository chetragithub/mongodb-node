import { Router } from 'express'
import reportService from '../services/reports.js'

export default function initRoutes() {
  const router = new Router()

  router.get('/', reportService.filter)
  return router
}