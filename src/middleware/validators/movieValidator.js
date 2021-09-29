const Joi = require('joi')

const movieSchema = Joi.object({
  title: Joi.string().required(),
  releaseDate: Joi.date().required(),
  rating: Joi.number().min(1).max(5).required(),
  image: Joi.string().required(),
})

const validateMovie = (req, res, next) => {
  const result = movieSchema.validate(req.body, {
    abortEarly: false,
  })

  if (!result.error) {
    next()
  } else {
    const errors = result.error.details.map((err) => ({ message: err.message }))
    res.status(400).json(errors)
  }
}

module.exports = {
  validateMovie,
}
