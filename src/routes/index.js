const express = require('express')
const db = require('../models')

const route = express.Router()
const Character = db.Character

route.get('/characters', async (req, res) => {
  const characters = await Character.findAll()
  res.json(characters)
})

route.get('/characters/:id', async (req, res) => {
  const character = await Character.findByPk(req.params.id)
  if (character) {
    res.json(character)
  } else {
    res.status(404).json({ message: 'character not found' })
  }
})

module.exports = route
