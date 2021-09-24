const express = require('express')

const authController = require('../controllers/authController')
const characterController = require('../controllers/characterController')

const route = express.Router()

route.post('/auth/register', authController.register)

route.post('/characters', characterController.store)
route.get('/characters', characterController.index)
route.get('/characters/:id', characterController.show)

module.exports = route
