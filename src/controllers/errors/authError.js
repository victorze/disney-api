class UserExistsError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'The email is already associated with an account'
    this.status = 409
    this.name = 'UserExistsError'
  }
}

class IncorrectCredentials extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'Invalid credentials'
    this.status = 400
    this.name = 'IncorrectCredentials'
  }
}

class JWTAuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.message = message || 'JWT authentication error'
    this.status = 401
    this.name = 'JWTAuthenticationError'
  }
}

module.exports = {
  UserExistsError,
  IncorrectCredentials,
  JWTAuthenticationError,
}
