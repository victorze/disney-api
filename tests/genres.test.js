const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const Genre = db.Genre
const User = db.User
const basePath = '/genres'

process.env.JWT_SECRET = 'secret'

describe('characters', () => {
  let authToken

  beforeAll((done) => {
    User.destroy({ truncate: true }).then(() => {
      request(app)
        .post('/auth/register')
        .send({
          email: 'foo@email.com',
          password: 'foofoo',
          confirmPassword: 'foofoo',
        })
        .end((err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.token).toBeDefined()
          authToken = res.body.token
          done()
        })
    })
  })

  afterAll(() => {
    server.close()
  })

  // Read a specific character
  describe('GET /genres/:id', () => {
    test('Genders exist, return genre', (done) => {
      Genre.findAll()
        .then((genresInDB) => {
          const [firstGenreInDB] = genresInDB
          request(app)
            .get(`${basePath}/${firstGenreInDB.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.id).toBe(firstGenreInDB.id)
              expect(res.body.name).toBe(firstGenreInDB.name)
              expect(res.body.image).toBe(firstGenreInDB.image)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Genre does not exist, return status 404', (done) => {
      request(app)
        .get(`${basePath}/123`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.body.message.includes('not found')).toBeTruthy()
          done()
        })
    })
  })
})
