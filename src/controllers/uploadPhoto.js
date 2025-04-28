const cloudinary = require('../configs/cloudinary')
const User = require('~/models/user')

const uploadImage = async (buffer, userId) => {
  const folderPath = `sp_project/users/${userId}`

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        folder: `${folderPath}`,
        transformation: [
          { width: 600, crop: 'limit' },
          { fetch_format: 'auto', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    stream.end(buffer)
  })
}

const uploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 'No file provided' })
    }

    const userId = req.user.id
    const result = await uploadImage(req.file.buffer, userId)
    await User.findByIdAndUpdate(userId, { photo: result.public_id })

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ code: 'Failed to upload image' })
  }
}

module.exports = { uploadController }
