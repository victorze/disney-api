const db = require('../models')

const User = db.User

const register = async (req, res) => {
  const user = User.build(req.body)
  user.setPassword(req.body.password)
  const token = user.generateJwt()
  await user.save()
  res.status(201).json({ token })
}

module.exports = {
  register,
}
