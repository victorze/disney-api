const { server } = require('../../src/server')
const db = require('../../src/models')

const User = db.User

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
})
