import { Router } from 'express'
import reportService from '../services/reports.js'

export default function initRoutes() {
  const router = new Router()

  router.get('/money', reportService.moneyReps)
  router.get('/product', reportService.productReps)
  return router
}