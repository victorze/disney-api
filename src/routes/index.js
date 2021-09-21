const express = require('express')

const router = express.Router()

router.get('/characters', (req, res) => {
  res.json({ message: 'baz' })
})

module.exports = router
