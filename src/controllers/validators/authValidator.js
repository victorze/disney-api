const Joi = require('joi')

const schema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  name: Joi.string().alphanum().min(3).max(30),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),

  confirmPassword: Joi.ref('password'),
}).with('password', 'confirmPassword')

const validateRegister = (req, res, next) => {
  const result = schema.validate(req.body, {
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
}
