const cloudinary = require('../configs/cloudinary')

const uploadImage = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        folder: 'sp_project/images',
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
      return res.status(400).json({ error: 'No file provided' })
    }

    const result = await uploadImage(req.file.buffer)

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
}

module.exports = { uploadController }
