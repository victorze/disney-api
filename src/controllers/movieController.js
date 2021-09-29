const db = require('../models')
const { catchErrors } = require('../middleware/errors')
const { NotFoundError } = require('./errors/httpError')

const Movie = db.Movie

const store = async (req, res) => {
  const movie = await Movie.create(req.body)
  res.status(201).json(movie)
}

const index = async (req, res) => {
  let movies = await Movie.findAll({
    attributes: ['id', 'title', 'releaseDate', 'image'],
  })
  res.json(movies)
}

const show = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id)
  if (!movie) throw new NotFoundError()
  res.json(movie)
}

const update = async (req, res) => {
  const [updatedRows, [updatedMovie]] = await Movie.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  })
  if (updatedRows === 0) throw new NotFoundError()
  res.json(updatedMovie)
}

module.exports = {
  store: catchErrors(store),
  index: catchErrors(index),
  show: catchErrors(show),
  update: catchErrors(update),
}
