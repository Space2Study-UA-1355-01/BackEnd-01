const express = require('express')
const multer = require('multer')
const { uploadController } = require('../controllers/uploadPhoto')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('image'), uploadController)

module.exports = router
