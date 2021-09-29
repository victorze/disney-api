const db = require('../models')
const { catchErrors } = require('../middleware/errors')

const Movie = db.Movie

const store = async (req, res) => {
  const movie = await Movie.create(req.body)
  res.status(201).json(movie)
}

module.exports = {
  store: catchErrors(store),
}
