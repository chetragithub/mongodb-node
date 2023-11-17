import { Router } from 'express'
import productService from '../services/products.js'
import ensureFields from '../middleware/ensure-fields.js'

export default function initRoutes() {
  const router = new Router()

  router.get('/', productService.getAll)
  router.get(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isLength: { options: { max: 24, min: 24 } },
        },
      },
      { limitTo: ['params'] }
    ),
    productService.getById
  )
  router.post(
    '/',
    ensureFields(
      {
        category_id: {
          notEmpty: true,
          isLength: { options: { max: 24, min: 24 } },
        },
        name: {
          notEmpty: true,
          isLength: { options: { max: 250, min: 1 } },
        },
        product_code: {
          notEmpty: true,
          isLength: { options: { max: 50, min: 1 } },
        },
        description: {
          notEmpty: false,
          isLength: { options: { max: 250, min: 1 } },
        },
        image: {
          notEmpty: true,
          isLength: { options: { max: 500 } },
        },
        is_active: {
          notEmpty: true,
          toBoolean: true,
          isBoolean: true,
        },
        product_customizes: {
          optional: false,
          isArray: { options: { min: 1 } },
        },
        'product_customizes.*.size': {
          notEmpty: true,
          toString: true,
          isLength: {
            options: { max: 50, min: 1 },
          },
        },
        'product_customizes.*.price': {
          notEmpty: true,
          toInt: true,
          isInt: true,
        },
      },
      { limitTo: ['body'] }
    ),
    productService.create
  )
  router.put(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isLength: { options: { max: 24, min: 24 } },
        },
        category_id: {
          notEmpty: true,
          isLength: { options: { max: 24, min: 24 } },
        },
        name: {
          notEmpty: true,
          isLength: { options: { max: 250, min: 1 } },
        },
        product_code: {
          notEmpty: true,
          isLength: { options: { max: 50, min: 1 } },
        },
        description: {
          notEmpty: false,
          isLength: { options: { max: 250, min: 1 } },
        },
        image: {
          notEmpty: true,
          isLength: { options: { max: 500 } },
        },
        is_active: {
          notEmpty: true,
          toBoolean: true,
          isBoolean: true,
        },
        product_customizes: {
          optional: false,
          isArray: { options: { min: 1 } },
        },
        'product_customizes.*.product_customize_id': {
          optional: true,
          toString: true,
          isLength: {
            options: { max: 24, min: 24 },
          },
        },
        'product_customizes.*.size': {
          notEmpty: true,
          toString: true,
          isLength: {
            options: { max: 50, min: 1 },
          },
        },
        'product_customizes.*.price': {
          notEmpty: true,
          toInt: true,
          isInt: true,
        },
      },
      { limitTo: ['params', 'body'] }
    ),
    productService.update
  )
  router.delete(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isLength: { options: { max: 24, min: 24 } },
        },
      },
      { limitTo: ['params'] }
    ),
    productService.destroy
  )
  return router
}
