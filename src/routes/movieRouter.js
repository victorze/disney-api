const route = require('express').Router()
const movieController = require('../controllers/movieController')
const { auth } = require('../middleware/authentication')
const { uploadImage } = require('../middleware/uploadFile')
const { validateMovie } = require('../middleware/validators/movieValidator')

route.use(auth)

route.post('/', [uploadImage('image'), validateMovie], movieController.store)
route.get('/', movieController.index)
route.get('/:id', movieController.show)
route.put('/:id', uploadImage('image'), movieController.update)
route.delete('/:id', movieController.destroy)

module.exports = route
