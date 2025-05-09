const express = require('express')
const { createUpload } = require('~/middlewares/multer')
const { authMiddleware } = require('~/middlewares/auth')
const { uploadController } = require('../controllers/uploadPhoto')

const router = express.Router()

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'), false)
  }
}

const upload = createUpload({ fileFilter })

router.post('/', authMiddleware, upload.single('image'), uploadController)

module.exports = router
