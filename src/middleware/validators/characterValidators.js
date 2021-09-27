const Joi = require('joi')

const characterSchema = Joi.object({
  name: Joi.string().required().alphanum().min(3).max(30),
  age: Joi.number().required(),
  weight: Joi.number().required(),
  story: Joi.string().required(),
})

const validateCharacter = (req, res, next) => {
  const result = characterSchema.validate(req.body, {
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
  validateCharacter,
}
