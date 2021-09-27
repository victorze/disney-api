const express = require('express')

const authController = require('../controllers/authController')
const characterController = require('../controllers/characterController')
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validators/authValidator')
const { validateCharacter } = require('../middleware/validators/characterValidators')
const { emailToLowerCase } = require('../middleware')
const { auth } = require('../middleware/authentication')

const route = express.Router()

route.post(
  '/auth/register',
  [validateRegister, emailToLowerCase],
  authController.register
)
route.post(
  '/auth/login',
  [validateLogin, emailToLowerCase],
  authController.login
)

route.post('/characters', [auth, validateCharacter], characterController.store)
route.get('/characters', auth, characterController.index)
route.get('/characters/:id', auth, characterController.show)

module.exports = route
