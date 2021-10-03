const auth = require('./auth')
const characters = require('./characters')
const genres = require('./genres')

module.exports = {
  paths: {
    '/auth/register': {
      ...auth.register,
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
    '/auth/login': {
      ...auth.login,
    },
    '/genres/{id}': {
      ...genres.show,
    },
  },
}
