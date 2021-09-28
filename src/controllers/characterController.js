const { catchErrors } = require('../middleware/errors')
const db = require('../models')

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

  if (character) {
    res.json(character)
  } else {
    res.status(404).json({ message: 'character not found' })
  }
}

module.exports = {
  index,
  store: catchErrors(store),
  show,
}
