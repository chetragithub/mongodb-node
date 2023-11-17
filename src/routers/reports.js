import { Router } from 'express'
import reportService from '../services/reports.js'
import ensureFields from '../middleware/ensure-fields.js'

export default function initRoutes() {
  const router = new Router()

  router.get(
    '/money',
    ensureFields(
      {
        year: {
          notEmpty: true,
          toInt: true,
          isInt: true,
        },
      },
      { limitTo: ['query'] }
    ),
    reportService.moneyReps
  )
  router.get(
    '/product',
    ensureFields(
      {
        month: {
          notEmpty: true,
          toInt: true,
          isInt: true,
        },
        year: {
          notEmpty: true,
          toInt: true,
          isInt: true,
        },
      },
      { limitTo: ['query'] }
    ),
    reportService.productReps
  )
  return router
}
