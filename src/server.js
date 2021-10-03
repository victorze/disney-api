require('dotenv').config()
const path = require('path')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../docs')

const { notFound, productionErrors } = require('./middleware/errors')
const db = require('./models')
db.sync()

const app = express()
app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  process.env.SCHEME_AND_HOST = `${req.protocol}://${req.get('host')}`
  next()
})

app.use(cors())

app.use(require('./routes'))
app.get('/', (req, res) => res.redirect('/api-docs'))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(notFound)
app.use(productionErrors)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Starting development server at http://localhost:${PORT}`)
  }
})

module.exports = {
  app,
  server,
}
