const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const Character = db.Character
const User = db.User
const basePath = '/characters'

process.env.JWT_SECRET = 'secret'

const dummyCharacters = [
  {
    name: 'Jane',
    age: 33,
    weight: 88.5,
    story: 'Jane story',
    image: '/images/jane.png',
  },
  {
    name: 'Joe',
    age: 40,
    weight: 70.8,
    story: 'Joe story',
    image: '/images/joe.png',
  },
]

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

  beforeEach((done) => {
    Character.destroy({ truncate: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  // Create new character
  describe(`POST ${basePath}`, () => {
    test('If the token is valid and the data is valid, the character is created', (done) => {
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
          expect(res.body.image.includes('http')).toBeTruthy()

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

    test('A character with incomplete data will not be created', (done) => {
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

    test('Trying to create a character without sending token returns 401', (done) => {
      const [dummyCharacter] = dummyCharacters

      request(app)
        .post(basePath)
        .send(dummyCharacter)
        .end((err, res) => {
          expect(res.status).toBe(401)
          expect(res.body.message).toBeDefined()
          done()
        })
    })
  })

  // Read list of characters
  describe('GET /characters', () => {
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

              const [character] = res.body
              expect(Object.keys(character)).toHaveLength(3)
              expect(character.id).toBeDefined()
              expect(character.name).toBeDefined()
              expect(character.image).toBeDefined()
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

  // Read a specific character
  describe('GET /characters/:id', () => {
    test('Character exist, return character', (done) => {
      const [dummyCharacter] = dummyCharacters

      Character.create(dummyCharacter)
        .then((character) => {
          request(app)
            .get(`${basePath}/${character.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.name).toBe(character.name)
              expect(res.body.age).toBe(character.age)
              expect(res.body.weight).toBe(character.weight)
              expect(res.body.story).toBe(character.story)
              expect(res.body.image.includes(character.image)).toBeTruthy()
              expect(res.body.image.includes('http')).toBeTruthy()
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
          expect(res.body.message.includes('not found')).toBeTruthy()
          done()
        })
    })
  })

  // Update a specific character
  describe('GET /characters/:id', () => {
    test('Character exist, update character', (done) => {
      const [dummyCharacter] = dummyCharacters

      Character.create(dummyCharacter)
        .then((character) => {
          request(app)
            .put(`${basePath}/${character.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .field('name', 'Goofy')
            .attach('image', __dirname + '/resources/goofy.png')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.name).toBe('Goofy')
              expect(res.body.image.includes('goofy.png')).toBeTruthy()
              expect(res.body.image.includes('http')).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Character does not exist, return status 404', (done) => {
      request(app)
        .put(`${basePath}/123`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Goofy')
        .attach('image', __dirname + '/resources/goofy.png')
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.body.message.includes('not found')).toBeTruthy()
          done()
        })
    })
  })

  // Delete a specific character
  describe('DELETE /characters/:id', () => {
    test('If the character exists, delete it', (done) => {
      const [dummyCharacter] = dummyCharacters

      Character.create(dummyCharacter)
        .then((character) => {
          request(app)
            .delete(`${basePath}/${character.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(204)
              expect(res.body).toEqual({})
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('If the character does not exist, return status 404', (done) => {
      request(app)
        .delete(`${basePath}/123`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.body.message.includes('not found')).toBeTruthy()
          done()
        })
    })
  })
})
