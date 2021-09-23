const express = require('express')
const db = require('../models')

const route = express.Router()
const Character = db.Character
const User = db.User

route.post('/users/register', async (req, res) => {
  const user = User.build(req.body)
  user.setPassword(req.body.password)
  const token = user.generateJwt()
  await user.save()
  res.status(201).json({token})
})

route.post('/characters', async (req, res) => {
  const character = await Character.create(req.body)
  res.status(201).json(character)
})

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
