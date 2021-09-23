const express = require('express')
const db = require('../models')

const router = express.Router()
const Character = db.Character

router.get('/characters', (req, res) => {
  res.json({ message: 'baz' })
})

router.get('/characters/:id', async (req, res) => {
  const character = await Character.findByPk(req.params.id)
  if (character) {
    res.json(character)
  } else {
    res.status(404).json({ message: 'character not found' })
  }
})

module.exports = router
