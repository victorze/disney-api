const register = require('./register')

module.exports = {
  paths: {
    '/auth/register': {
      ...register,
    },
  },
}
