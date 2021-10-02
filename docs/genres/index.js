const show = require('./show')

module.exports = {
  paths: {
    '/genres/{id}': {
      ...show,
    },
  },
}
