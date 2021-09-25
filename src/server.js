require('dotenv').config()
const express = require('express')
const logger = require('morgan')

const routes = require('./routes')
const { notFound, productionErrors } = require('./handlers')

const app = express()

const db = require('./models')

db.sequelize.sync({ alter: true })

app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use(express.json())

app.use('/api', routes)

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
