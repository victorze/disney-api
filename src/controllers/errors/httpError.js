class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'Resource not found'
    this.status = 404
    this.name = 'NotFoundError'
  }
}

module.exports = {
  NotFoundError,
}
