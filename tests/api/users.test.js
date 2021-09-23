const request = require('supertest')
const { app, server } = require('../../src/server')
const db = require('../../src/models')

const User = db.User

process.env.JWT_SECRET = 'secret'

const dummyUser = {
  name: 'foo',
  email: 'foo@email.com',
  password: 'foofoo',
}

describe('users', () => {
  beforeEach((done) => {
    User.destroy({ truncate: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /api/users/register', () => {
    test('Register a user', (done) => {
      request(app)
        .post('/api/users/register')
        .send(dummyUser)
        .end((err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.token).toBeDefined()

          User.findAll({ where: { email: dummyUser.email } })
            .then((users) => {
              expect(users).toBeInstanceOf(Array)
              expect(users).toHaveLength(1)

              const [user] = users
              expect(user.name).toBe(dummyUser.name)
              expect(user.email).toBe(dummyUser.email)
              expect(user.validPassword(dummyUser.password)).toBeTruthy()
              done()
            })
            .catch(err => {
              done(err)
            })
        })
    })
  })
})
