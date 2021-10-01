const route = require('express').Router()
const genreController = require('../controllers/genreController')
const { auth } = require('../middleware/authentication')

route.use(auth)

route.get('/:id', genreController.show)

module.exports = route
