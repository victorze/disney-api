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

db.User = require('./user')(sequelize)
db.Character = require('./character')(sequelize)
db.Movie = require('./movie')(sequelize)
db.Genre = require('./genre')(sequelize)

db.Genre.count().then((numberOfGenres) => {
  if (numberOfGenres === 0) {
    db.Genre.bulkCreate(db.Genre.data).then('List of genres created')
  }
})

// Associations
db.Movie.belongsToMany(db.Character, {
  through: 'CharacterMovies',
  as: 'characters',
  foreignKey: 'movieId',
})
db.Character.belongsToMany(db.Movie, {
  through: 'CharacterMovies',
  as: 'movies',
  foreignKey: 'characterId',
})

db.Movie.belongsToMany(db.Genre, {
  through: 'GenreMovies',
  as: 'genres',
  foreignKey: 'movieId',
})
db.Genre.belongsToMany(db.Movie, {
  through: 'GenreMovies',
  as: 'movies',
  foreignKey: 'genreId',
})

module.exports = db
