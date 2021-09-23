const notFound = (req, res, next) => {
  const err = new Error('Aquí no hay nada.')
  err.status = 404
  next(err)
}

/* eslint-disable no-unused-vars */
const productionErrors = (err, req, res, next) => {
  res.status(err.status || 500)
  res.json({ error: err.message })
}

module.exports = {
  notFound,
  productionErrors,
}
