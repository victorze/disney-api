const db = require('../models')
const { catchErrors } = require('../middleware/errors')
const { NotFoundError} = require('./errors/httpError')

const Character = db.Character

const index = async (req, res) => {
  let characters = await Character.findAll({
    attributes: ['id', 'name', 'image'],
  })
  res.json(characters)
}

const store = async (req, res) => {
  const character = await Character.create(req.body)
  res.status(201).json(character)
}

const show = async (req, res) => {
  const character = await Character.findByPk(req.params.id)
  if (!character) throw new NotFoundError()
  res.json(character)
}

const update = async (req, res) => {
  const [updatedRows, [updatedCharacter]] = await Character.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  })
  if (updatedRows === 0) throw new NotFoundError()
  res.json(updatedCharacter)
}

const destroy = async (req, res) => {
  const deletedRows = await Character.destroy({ where: { id: req.params.id } })
  if (deletedRows === 0) throw new NotFoundError()
  res.status(204).json(null)
}

module.exports = {
  index: catchErrors(index),
  store: catchErrors(store),
  show: catchErrors(show),
  update: catchErrors(update),
  destroy: catchErrors(destroy),
}
