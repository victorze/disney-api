const jwt = require('jsonwebtoken')
const request = require('supertest')

const { app, server } = require('../src/server')
const db = require('../src/models')

const User = db.User
const basePath = '/api/auth'

process.env.JWT_SECRET = 'secret'

const dummyUser = {
  name: 'foo',
  email: 'foo@email.com',
  password: 'foofoo',
  confirmPassword: 'foofoo',
}

describe('users (auth)', () => {
  beforeEach((done) => {
    User.destroy({ truncate: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  describe(`POST ${basePath}/register`, () => {
    test('A valid user should be created', (done) => {
      request(app)
        .post(`${basePath}/register`)
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
            .catch((err) => {
              done(err)
            })
        })
    })

    test('Creating a user with an email already registered should fail', (done) => {
      const user = User.build(dummyUser)
      user.setPassword(dummyUser.password)

      user
        .save()
        .then(() => {
          request(app)
            .post(`${basePath}/register`)
            .send(dummyUser)
            .end((err, res) => {
              expect(res.status).toBe(409)
              expect(res.body.message).toBeDefined()
              expect(res.text.includes('email')).toBeTruthy()
              done()
            })
        })
        .catch((err) => {
          done(err)
        })
    })

    test('If the passwords do not match, the user should not be created', (done) => {
      request(app)
        .post(`${basePath}/register`)
        .send({
          ...dummyUser,
          confirmPassword: 'foo',
        })
        .end((err, res) => {
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(1)
          expect(res.text.includes('confirmPassword')).toBeTruthy()
          done()
        })
    })

    test('A user with an invalid email should not be created', (done) => {
      request(app)
        .post(`${basePath}/register`)
        .send({
          ...dummyUser,
          email: '@email.com',
        })
        .end((err, res) => {
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(1)
          expect(res.text.includes('email')).toBeTruthy()
          done()
        })
    })
  })

  test('Check password', () => {
    const user = User.build(dummyUser)
    user.setPassword(dummyUser.password)
    expect(user.validPassword(dummyUser.password)).toBeTruthy()
    expect(user.validPassword('secret')).toBeFalsy()
  })

  test('JWT', () => {
    const user = User.build(dummyUser)
    const token = user.generateJwt()
    const decoded = jwt.verify(token, 'secret')

    expect(decoded.email).toBe(user.email)
    expect(() => jwt.verify(token, 'qwerty')).toThrow(jwt.JsonWebTokenError)
  })
})
