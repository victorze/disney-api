const router = require('express').Router()

router.use('/auth', require('./authRouter'))
router.use('/characters', require('./characterRouter'))

module.exports = router
