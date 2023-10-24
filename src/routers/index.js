import middleware from '../middleware/auth.js'
import initPostsRoutes from './posts.js'
import initProductsRoutes from './products.js'
import initAuthRoutes from './auth.js'
export default function initAppRoutes(app) {
  app.use('/api/products', middleware, initProductsRoutes())
  app.use('/api/posts', middleware, initPostsRoutes())
  app.use('/api/auth', initAuthRoutes(middleware))
}
