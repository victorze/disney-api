const router = require('express').Router()

router.use('/auth', require('./authRouter'))
router.use('/characters', require('./characterRouter'))
router.use('/movies', require('./movieRouter'))

module.exports = router
