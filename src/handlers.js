const jwt = require('jsonwebtoken')
const db = require('./models')

const User = db.User

const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(next)

const notFound = (req, res, next) => {
  const err = new Error('Aquí no hay nada.')
  err.status = 404
  next(err)
}

/* eslint-disable no-unused-vars */
const productionErrors = (err, req, res, next) => {
  res.status(err.status || 500)
  res.json({ message: err.message })
}

class JWTAuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'JWT authentication error.'
    this.status = 401
    this.name = 'JWTAuthenticationError'
  }
}

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
  notFound,
  productionErrors,
  catchErrors,
  auth: catchErrors(auth),
}
