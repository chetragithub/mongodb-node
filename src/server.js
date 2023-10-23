import app from './app.js'
import initDb from '../mongodb/index.js'
import initAppRoutes from './routers/index.js'

app.listen(5000, () => {
  console.log('Server is running on url: http//localhost:5000')
})
initDb()
initAppRoutes(app)
