const sgMail = require('@sendgrid/mail')
const db = require('../models')
const { UserExistsError, IncorrectCredentials } = require('./errors/authError')
const { catchErrors } = require('../middleware/errors')

const User = db.User

const sendWelcomeEmail = async (to) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const msg = {
    to: to,
    from: process.env.MAIL_FROM_ADDRESS,
    subject: 'Welcome to Disney API!',
    text: 'Enjoy!',
    html: '<h3 style="text-align: center;">Enjoy!<h3>',
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(error)
  }
}

const register = async (req, res) => {
  const [userExists] = await User.findAll({ where: { email: req.body.email } })

  if (userExists) {
    throw new UserExistsError()
  } else {
    const user = User.build(req.body)
    user.setPassword(req.body.password)
    await user.save()
    const token = user.generateJwt()

    if (process.env.NODE_ENV !== 'test') {
      await sendWelcomeEmail(user.email)
    }

    res.status(201).json({ token })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  const [user] = await User.findAll({ where: { email } })

  if (!user) {
    throw new IncorrectCredentials('El correo electrónico no está registrado')
  }

  if (user.verifyPassword(password)) {
    const token = user.generateJwt()
    res.json({ token })
  } else {
    throw new IncorrectCredentials()
  }
}

module.exports = {
  register: catchErrors(register),
  login: catchErrors(login),
}
