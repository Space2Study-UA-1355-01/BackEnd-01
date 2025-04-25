const multer = require('multer')

// const storage = multer.memoryStorage()
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024,
//     fieldNameSize: 100
//   }
// })

const defaultStorage = multer.memoryStorage()

const defaultLimits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  fieldNameSize: 100
}
const createUpload = ({ storage = defaultStorage, limits = defaultLimits, fileFilter } = {}) => {
  return multer({
    storage,
    limits,
    fileFilter
  })
}

const upload = createUpload()

module.exports = { upload, createUpload }
