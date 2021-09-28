const router = require('express').Router()

router.use('/api/auth', require('./auth'))
router.use('/api/characters', require('./characters'))

module.exports = router
