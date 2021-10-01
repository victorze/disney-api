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
    where: req.query,
  })
  res.json(movies)
}

const show = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id, {
    include: 'characters',
  })
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

const destroy = async (req, res) => {
  const deletedRows = await Movie.destroy({ where: { id: req.params.id } })
  if (deletedRows === 0) throw new NotFoundError()
  res.status(204).json(null)
}

module.exports = {
  store: catchErrors(store),
  index: catchErrors(index),
  show: catchErrors(show),
  update: catchErrors(update),
  destroy: catchErrors(destroy),
}
