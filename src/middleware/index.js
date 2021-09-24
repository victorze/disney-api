const emailToLowerCase = (req, res, next) => {
  req.body.email && (req.body.email = req.body.email.toLowerCase())
  next()
}

module.exports = {
  emailToLowerCase,
}
