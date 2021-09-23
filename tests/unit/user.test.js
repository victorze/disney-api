const jwt = require("jsonwebtoken")

const { server } = require('../../src/server')
const db = require('../../src/models')

const User = db.User

process.env.JWT_SECRET = 'secret'

describe('User', () => {
  afterAll(() => {
    server.close()
  })

  test('Check password', () => {
    const user = User.build({ email: 'foo@email', name: 'foo' })
    user.setPassword('foofoo')
    expect(user.validPassword('foofoo')).toBeTruthy()
    expect(user.validPassword('secret')).toBeFalsy()
  })

  test('JWT', () => {
    const user = User.build({ email: 'foo@email', name: 'foo' })
    const token = user.generateJwt()
    let decoded = jwt.verify(token, 'secret')

    expect(decoded.email).toBe(user.email)
    expect(() => jwt.verify(token, 'qwerty')).toThrow(jwt.JsonWebTokenError)
  })
})
