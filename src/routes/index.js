const router = require('express').Router()

router.use('/api/auth', require('./authRouter'))
router.use('/api/characters', require('./characterRouter'))

module.exports = router
