const { catchErrors } = require('../middleware/errors')
const db = require('../models')

const Character = db.Character

const index = async (req, res) => {
  const characters = await Character.findAll()
  res.json(characters)
}

const store = async (req, res) => {
  const character = await Character.create(req.body)
  character.image = req.schemeAndHost + character.image
  res.status(201).json(character)
}

const show = async (req, res) => {
  const character = await Character.findByPk(req.params.id)

  if (character) {
    character.image = req.schemeAndHost + character.image
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
