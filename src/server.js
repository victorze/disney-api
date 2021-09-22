require('dotenv').config()
const express = require('express')
const logger = require('morgan')

const router = require('./routes')

const app = express()

const db = require('./model')
db.sequelize.sync()

app.use(logger('dev'))
app.use(express.json())

app.get('/', function (req, res) {
  res.json({ foo: 'bar' })
})

app.use('/api', router)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})

module.exports = {
  app,
  server,
}
