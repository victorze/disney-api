const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images')
  },
  filename: (req, file, cb) => {
    const savedFileName = Date.now() + '-' + file.originalname
    req.body[file.fieldname] = savedFileName
    cb(null, savedFileName)
  },
})

const upload = multer({ storage })

const imageUpload = (fieldName) => {
  return upload.single(fieldName)
}

module.exports = {
  upload,
}
