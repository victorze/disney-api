class UserExistsError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'El email ya está asociado con una cuenta.'
    this.status = 409
    this.name = 'UserExistsError'
  }
}

class IncorrectCredentials extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'Credenciales incorrectas.'
    this.status = 400
    this.name = 'IncorrectCredentials'
  }
}

module.exports = {
  UserExistsError,
  IncorrectCredentials,
}
