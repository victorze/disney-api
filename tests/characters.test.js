const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const Character = db.Character
const User = db.User

process.env.JWT_SECRET = 'secret'

const dummyCharacters = [
  {
    name: 'Jane',
    age: 33,
    weight: 88.5,
    story: 'Jane story',
    image: 'Jane image link',
  },
  {
    name: 'Joe',
    age: 40,
    weight: 70.8,
    story: 'Joe story',
    image: 'Joe image link',
  },
]

describe('characters', () => {
  let authToken

  beforeAll((done) => {
    User.destroy({ truncate: true }).then(() => {
      request(app)
        .post('/api/auth/register')
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

  beforeEach((done) => {
    Character.destroy({ truncate: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /api/characters', () => {
    test('Valid character created', (done) => {
      const [character] = dummyCharacters

      request(app)
        .post('/api/characters')
        .send(character)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.name).toBe(character.name)
          expect(res.body.age).toBe(character.age)
          expect(res.body.weight).toBe(character.weight)
          expect(res.body.story).toBe(character.story)
          expect(res.body.image).toBe(character.image)
          done()
        })
    })
  })

  describe('GET /api/characters', () => {
    test('There are characters, return an array', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then(() => {
          request(app)
            .get('/api/characters')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(2)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('There are no characters, return empty array', (done) => {
      request(app)
        .get('/api/characters')
        .end((err, res) => {
          expect(res.status).toBe(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(0)
          done()
        })
    })
  })

  describe('GET /api/characters/:id', () => {
    const [character] = dummyCharacters

    test('Character exist, return character', (done) => {
      Character.create(character)
        .then((data) => {
          request(app)
            .get(`/api/characters/${data.id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.name).toBe(data.name)
              expect(res.body.age).toBe(data.age)
              expect(res.body.weight).toBe(data.weight)
              expect(res.body.story).toBe(data.story)
              expect(res.body.image).toBe(data.image)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Character does not exist, return status 404', (done) => {
      request(app)
        .get('/api/characters/123')
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.text.includes('not found')).toBeTruthy()
          done()
        })
    })
  })
})
