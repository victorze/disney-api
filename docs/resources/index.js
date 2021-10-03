const auth = require('./auth')
const genres = require('./genres')

module.exports = {
  paths: {
    '/auth/register': {
      ...auth.register,
    },
    '/auth/login': {
      ...auth.login,
    },
    '/genres/{id}': {
      ...genres.show,
    },
  },
}
