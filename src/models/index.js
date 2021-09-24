const Sequelize = require('sequelize')

const DB_DATABASE =
  process.env.DB_DATABASE + (process.env.NODE_ENV == 'test' ? 'test' : '')

const sequelize = new Sequelize(
  DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    logging: process.env.NODE_ENV != 'test',
  }
)

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Character = require('./character')(sequelize)
db.User = require('./user')(sequelize)

module.exports = db
