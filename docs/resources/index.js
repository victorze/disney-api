const auth = require('./auth')
const characters = require('./characters')
const movies = require('./movies')
const genres = require('./genres')

module.exports = {
  paths: {
    '/auth/register': {
      ...auth.register,
    },
    '/auth/login': {
      ...auth.login,
    },
    '/characters': {
      ...characters.store,
      ...characters.list,
    },
    '/characters/{id}': {
      ...characters.show,
      ...characters.update,
      ...characters.destroy,
    },
    '/movies': {
      ...movies.store,
      ...movies.list,
    },
    '/movies/{id}': {
      ...movies.show,
      ...movies.update,
      ...movies.destroy,
    },
    '/genres/{id}': {
      ...genres.show,
    },
  },
}
