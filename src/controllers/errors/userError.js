class UserExistsError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'El email ya están asociados con una cuenta.'
    this.status = 409
    this.name = 'UserExistsError'
  }
}

module.exports = {
  UserExistsError,
}
