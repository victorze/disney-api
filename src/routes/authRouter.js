const route = require('express').Router()
const authController = require('../controllers/authController')
const { emailToLowerCase } = require('../middleware')
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validators/authValidator')

route.use(emailToLowerCase)

route.post('/register', validateRegister, authController.register)
route.post('/login', validateLogin, authController.login)

module.exports = route
