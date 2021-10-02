const basicInfo = require('./basicInfo')
const servers = require('./servers')
const tags = require('./tags')
const components = require('./components')
const genres = require('./genres')

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  ...genres,
}
