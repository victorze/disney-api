const Joi = require('joi')

const registerSchema = Joi.object({
  email: Joi.string().required().email(),
  name: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
  confirmPassword: Joi.ref('password'),
}).with('password', 'confirmPassword')

const validateRegister = (req, res, next) => {
  const result = registerSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  })

  if (!result.error) {
    next()
  } else {
    const errors = result.error.details.map((err) => ({ message: err.message }))
    res.status(400).json(errors)
  }
}

const loginSchema = Joi.object({
  email: Joi.string().required().email(),

  password: Joi.string().required(),
})

const validateLogin = (req, res, next) => {
  const result = loginSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  })

  if (!result.error) {
    next()
  } else {
    const errors = result.error.details.map((err) => ({ message: err.message }))
    res.status(400).json(errors)
  }
}

module.exports = {
  validateRegister,
  validateLogin,
}
