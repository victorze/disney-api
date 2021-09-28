const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const Character = db.Character
const User = db.User
const basePath = '/api/characters'

process.env.JWT_SECRET = 'secret'

const dummyCharacters = [
  {
    name: 'Jane',
    age: 33,
    weight: 88.5,
    story: 'Jane story',
  },
  {
    name: 'Joe',
    age: 40,
    weight: 70.8,
    story: 'Joe story',
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

  describe(`POST ${basePath}`, () => {
    test('Create a character with valid token', (done) => {
      const [dummyCharacter] = dummyCharacters

      request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', dummyCharacter.name)
        .field('age', dummyCharacter.age)
        .field('weight', dummyCharacter.weight)
        .field('story', dummyCharacter.story)
        .attach('image', __dirname + '/resources/mickey.png')
        .end((err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.name).toBe(dummyCharacter.name)
          expect(res.body.age).toBe(dummyCharacter.age)
          expect(res.body.weight).toBe(dummyCharacter.weight)
          expect(res.body.story).toBe(dummyCharacter.story)
          expect(res.body.image.includes('mickey.png')).toBeTruthy()

          Character.findByPk(res.body.id)
            .then((character) => {
              expect(character).toBeInstanceOf(Character)

              expect(character.name).toBe(dummyCharacter.name)
              expect(character.age).toBe(dummyCharacter.age)
              expect(character.weight).toBe(dummyCharacter.weight)
              expect(character.story).toBe(dummyCharacter.story)
              expect(character.image.includes('mickey.png')).toBeTruthy()
              done()
            })
            .catch((err) => {
              done(err)
            })
        })
    })

    test('A character with invalid data will not be created', (done) => {
      request(app)
        .post(basePath)
        .send({
          name: 'Jane',
          age: 33,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Array)
          done()
        })
    })
  })

  test('Trying to create a character without sending token returns 401', (done) => {
    const [character] = dummyCharacters

    request(app)
      .post(basePath)
      .send(character)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.body.message).toBeDefined()
        done()
      })
  })

  describe('GET /api/characters', () => {
    test('There are characters, return an array', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then(() => {
          request(app)
            .get(basePath)
            .set('Authorization', `Bearer ${authToken}`)
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
        .get(basePath)
        .set('Authorization', `Bearer ${authToken}`)
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
            .get(`${basePath}/${data.id}`)
            .set('Authorization', `Bearer ${authToken}`)
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
        .get(`${basePath}/123`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.text.includes('not found')).toBeTruthy()
          done()
        })
    })
  })
})
