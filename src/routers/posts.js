import { Router } from 'express'
import postsService from '../services/posts.js'
// import fileUpload from 'express-fileupload'
import multer from 'multer'
import fs from 'fs'
// import { TMP } from '../constants/global.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync('tmp', { recursive: true })
    cb(null, 'tmp')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

export default function initRoutes() {
  const router = Router()
  router.get('/', postsService.getAll)
  router.get('/:id', postsService.findById)
  router.get('/filter', postsService.findAll)
  router.post('/', postsService.create)
  router.post('/import', upload.single('file'), postsService.importPosts)
  router.put('/:id', postsService.update)
  router.delete('/:id', postsService.destroy)
  return router
}
