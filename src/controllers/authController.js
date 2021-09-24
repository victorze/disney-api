const db = require('../models')
const { UserExistsError } = require('./errors/userError')
const { catchErrors } = require('../handlers/errors')

const User = db.User

const register = async (req, res) => {
  const [userExists] = await User.findAll({ where: { email: req.body.email } })

  if (userExists) {
    throw new UserExistsError()
  } else {
    const user = User.build(req.body)
    user.setPassword(req.body.password)
    const token = user.generateJwt()
    await user.save()
    res.status(201).json({ token })
  }
}

module.exports = {
  register: catchErrors(register),
}
