let server

if (process.env.NODE_ENV === 'production') {
  server = {
    url: `${process.env.APP_URL_PRODUCTION}`,
    description: 'Production server',
  }
} else {
  server = {
    url: `http://localhost:/${process.env.PORT}`,
    description: 'Local server',
  }
}

module.exports = {
  servers: [server],
}
