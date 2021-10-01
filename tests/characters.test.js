const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const User = db.User
const Character = db.Character
const Movie = db.Movie
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

const dummyMovie = {
  title: 'The Lion King',
  releaseDate: new Date(1994, 6, 8),
  rating: 5,
  image: '/images/the-lion-king.png',
}

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
    Character.destroy({ truncate: { cascade: true } }).then(() => done())
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
        .attach('image', __dirname + '/resources/characters/mickey.png')
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
        .then((characters) => {
          const [characterInDB] = characters
          request(app)
            .get(basePath)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(2)

              const [character] = res.body
              expect(Object.keys(character)).toHaveLength(3)
              expect(character.id).toBe(characterInDB.id)
              expect(character.name).toBe(characterInDB.name)
              expect(character.image.includes(characterInDB.image)).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Filter characters by name', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then((characters) => {
          const [characterInDB] = characters
          request(app)
            .get(`${basePath}?name=${characterInDB.name}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(1)

              const [character] = res.body
              expect(character.id).toBe(characterInDB.id)
              expect(character.name).toBe(characterInDB.name)
              expect(character.image.includes(characterInDB.image)).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Filter characters by age', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then((characters) => {
          const [characterInDB] = characters
          request(app)
            .get(`${basePath}?age=${characterInDB.age}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(1)

              const [character] = res.body
              expect(character.id).toBe(characterInDB.id)
              expect(character.name).toBe(characterInDB.name)
              expect(character.image.includes(characterInDB.image)).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Filter characters by weight', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then((characters) => {
          const [characterInDB] = characters
          request(app)
            .get(`${basePath}?weight=${characterInDB.weight}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(1)

              const [character] = res.body
              expect(character.id).toBe(characterInDB.id)
              expect(character.name).toBe(characterInDB.name)
              expect(character.image.includes(characterInDB.image)).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Filter characters by movie id', (done) => {
      Character.bulkCreate(dummyCharacters)
        .then((charactersInDB) => {
          const [characterInDB] = charactersInDB
          Movie.create(dummyMovie)
            .then((movieInDB) => {
              characterInDB
                .addMovie(movieInDB)
                .then(() => {
                  request(app)
                    .get(`${basePath}?movies=${movieInDB.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                      expect(res.status).toBe(200)
                      expect(res.body).toBeInstanceOf(Array)
                      expect(res.body).toHaveLength(1)

                      const [character] = res.body
                      expect(character.id).toBe(characterInDB.id)
                      expect(character.name).toBe(characterInDB.name)
                      expect(character.image).toBe(characterInDB.image)

                      expect(character.movies).toBeInstanceOf(Array)
                      expect(character.movies).toHaveLength(1)
                      const [movie] = character.movies
                      expect(movie.id).toBe(movieInDB.id)
                      expect(movie.title).toBe(movieInDB.title)
                      expect(movie.image).toBe(movieInDB.image)
                      done()
                    })
                })
                .catch((err) => done(err))
            })
            .catch((err) => done(err))
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
          Movie.create(dummyMovie)
            .then((movieInDB) => {
              character
                .addMovie(movieInDB)
                .then(() => {
                  request(app)
                    .get(`${basePath}/${character.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                      expect(res.status).toBe(200)
                      expect(res.body.name).toBe(character.name)
                      expect(res.body.age).toBe(character.age)
                      expect(res.body.weight).toBe(character.weight)
                      expect(res.body.story).toBe(character.story)
                      expect(
                        res.body.image.includes(character.image)
                      ).toBeTruthy()
                      expect(res.body.image.includes('http')).toBeTruthy()
                      expect(res.body.movies).toBeInstanceOf(Array)
                      expect(res.body.movies).toHaveLength(1)

                      const [movie] = res.body.movies
                      expect(movie.title).toBe(movieInDB.title)
                      expect(movie.releaseDate).toBe(
                        movieInDB.releaseDate.toISOString()
                      )
                      expect(movie.rating).toBe(movieInDB.rating)
                      expect(movie.image).toBe(movieInDB.image)
                      done()
                    })
                })
                .catch((err) => done(err))
            })
            .catch((err) => done(err))
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
  describe('PUT /characters/:id', () => {
    test('Character exist, update character', (done) => {
      const [dummyCharacter] = dummyCharacters

      Character.create(dummyCharacter)
        .then((character) => {
          request(app)
            .put(`${basePath}/${character.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .field('name', 'Mickey')
            .attach('image', __dirname + '/resources/characters/mickey.png')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.name).toBe('Mickey')
              expect(res.body.age).toBe(dummyCharacter.age)
              expect(res.body.weight).toBe(dummyCharacter.weight)
              expect(res.body.story).toBe(dummyCharacter.story)
              expect(res.body.image.includes('mickey.png')).toBeTruthy()
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
        .field('name', 'Mickey')
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

              Character.findByPk(character.id)
                .then((character) => {
                  expect(character).toBeNull()
                  done()
                })
                .catch((err) => done(err))
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
