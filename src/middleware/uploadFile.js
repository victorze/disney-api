const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images')
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + '-' + file.originalname
    req.body[file.fieldname] = '/images/' + uniqueFileName
    cb(null, uniqueFileName)
  },
})

const upload = multer({ storage })

const uploadImage = (fieldName) => {
  return upload.single(fieldName)
}

module.exports = {
  uploadImage,
}
