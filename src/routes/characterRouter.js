const route = require('express').Router()
const characterController = require('../controllers/characterController')
const { auth } = require('../middleware/authentication')
const {
  validateCharacter,
} = require('../middleware/validators/characterValidator')
const { uploadImage } = require('../middleware/uploadFile')

route.use(auth)

route.post(
  '/',
  [uploadImage('image'), validateCharacter],
  characterController.store
)
route.get('/', characterController.index)
route.get('/:id', characterController.show)
route.delete('/:id', characterController.destroy)

module.exports = route
