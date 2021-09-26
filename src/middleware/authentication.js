const jwt = require('jsonwebtoken')
const db = require('../models')
const { JWTAuthenticationError } = require('../controllers/errors/authError')
const { catchErrors } = require('./errors')

const User = db.User

const auth = async (req, res, next) => {
  if (req.header('authorization')) {
    const token = req.header('authorization').substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.id)

      if (user) {
        req.user = user
        next()
      } else {
        throw new JWTAuthenticationError()
      }
    } catch (err) {
      throw new JWTAuthenticationError(err.message)
    }
  } else {
    throw new JWTAuthenticationError()
  }
}

module.exports = {
  auth: catchErrors(auth),
}
