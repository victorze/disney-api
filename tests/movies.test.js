const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const User = db.User
const Movie = db.Movie
const Character = db.Character
const basePath = '/movies'

process.env.JWT_SECRET = 'secret'

const dummyMovies = [
  {
    title: 'The Lion King',
    releaseDate: new Date(1994, 6, 8).toISOString(),
    rating: '5',
    image: '/images/the-lion-king.png',
  },
  {
    title: '101 Dalmatians',
    releaseDate: new Date(1961, 0, 25).toISOString(),
    rating: '4',
    image: '/images/101-dalmatians.png',
  },
]

const dummyCharacter = {
  name: 'Jane',
  age: 33,
  weight: 88.5,
  story: 'Jane story',
  image: '/images/jane.png',
}

describe('movies', () => {
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
    Movie.destroy({ truncate: { cascade: true } }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  // Create new movie
  describe(`POST ${basePath}`, () => {
    test('If the token is valid and the data is valid, the movie is created', (done) => {
      const [dummyMovie] = dummyMovies

      request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', dummyMovie.title)
        .field('releaseDate', dummyMovie.releaseDate)
        .field('rating', dummyMovie.rating)
        .attach('image', __dirname + '/resources/movies/the-lion-king.jpg')
        .end((err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.title).toBe(dummyMovie.title)
          expect(res.body.releaseDate).toBe(dummyMovie.releaseDate)
          expect(res.body.rating.toString()).toBe(dummyMovie.rating)
          expect(res.body.image.includes('the-lion-king.jpg')).toBeTruthy()
          expect(res.body.image.includes('http')).toBeTruthy()

          Movie.findByPk(res.body.id)
            .then((movie) => {
              expect(movie).toBeInstanceOf(Movie)
              expect(movie.title).toBe(dummyMovie.title)
              expect(movie.releaseDate.toISOString()).toBe(
                dummyMovie.releaseDate
              )
              expect(movie.rating.toString()).toBe(dummyMovie.rating)
              expect(movie.image.includes('the-lion-king.jpg')).toBeTruthy()
              done()
            })
            .catch((err) => {
              done(err)
            })
        })
    })

    test('A movie with incomplete data will not be created', (done) => {
      request(app)
        .post(basePath)
        .send({
          title: 'Aladdin',
          rating: 4,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Array)
          done()
        })
    })
  })

  // Read list of movies
  describe('GET /movies', () => {
    test('There are movies, return an array', (done) => {
      Movie.bulkCreate(dummyMovies)
        .then((movies) => {
          const [movieInDB] = movies
          request(app)
            .get(basePath)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(2)

              const [movie] = res.body
              expect(Object.keys(movie)).toHaveLength(4)
              expect(movie.id).toBe(movieInDB.id)
              expect(movie.title).toBe(movieInDB.title)
              expect(movie.releaseDate).toBe(
                movieInDB.releaseDate.toISOString()
              )
              expect(movie.image).toBe(movieInDB.image)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Filter movie by title', (done) => {
      Movie.bulkCreate(dummyMovies)
        .then((movies) => {
          const [movieInDB] = movies
          request(app)
            .get(`${basePath}?title=${movieInDB.title}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(1)

              const [movie] = res.body
              expect(movie.id).toBe(movieInDB.id)
              expect(movie.title).toBe(movieInDB.title)
              expect(movie.releaseDate).toBe(
                movieInDB.releaseDate.toISOString()
              )
              expect(movie.image).toBe(movieInDB.image)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('There are no movies, return empty array', (done) => {
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

  // Read a specific movie
  describe('GET /movies/:id', () => {
    test('Movie exist, return movie', (done) => {
      const [dummyMovie] = dummyMovies

      Movie.create(dummyMovie)
        .then((movie) => {
          Character.create(dummyCharacter)
            .then((characterInDB) => {
              movie
                .addCharacter(characterInDB)
                .then(() => {
                  request(app)
                    .get(`${basePath}/${movie.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                      expect(res.status).toBe(200)
                      expect(res.body.title).toBe(movie.title)
                      expect(res.body.releaseDate).toBe(
                        movie.releaseDate.toISOString()
                      )
                      expect(res.body.rating).toBe(movie.rating)
                      expect(res.body.image.includes(movie.image)).toBeTruthy()
                      expect(res.body.image.includes('http')).toBeTruthy()
                      expect(res.body.characters).toBeInstanceOf(Array)
                      expect(res.body.characters).toHaveLength(1)

                      const [character] = res.body.characters
                      expect(character.name).toBe(characterInDB.name)
                      expect(character.age).toBe(characterInDB.age)
                      expect(character.weight).toBe(characterInDB.weight)
                      expect(character.story).toBe(characterInDB.story)
                      expect(character.image).toBe(characterInDB.image)
                      done()
                    })
                })
                .catch((err) => done(err))
            })
            .catch((err) => done(err))
        })
        .catch((err) => done(err))
    })

    test('Movie does not exist, return status 404', (done) => {
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

  // Update a specific movie
  describe('PUT /movies/:id', () => {
    test('Movie exist, update movie', (done) => {
      const [dummyMovie] = dummyMovies

      Movie.create(dummyMovie)
        .then((movie) => {
          request(app)
            .put(`${basePath}/${movie.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .field('title', 'King')
            .attach('image', __dirname + '/resources/movies/the-lion-king.jpg')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.title).toBe('King')
              expect(res.body.releaseDate).toBe(movie.releaseDate.toISOString())
              expect(res.body.rating).toBe(movie.rating)
              expect(res.body.image.includes('the-lion-king.jpg')).toBeTruthy()
              expect(res.body.image.includes('http')).toBeTruthy()
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Movie does not exist, return status 404', (done) => {
      request(app)
        .put(`${basePath}/123`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'King')
        .end((err, res) => {
          expect(res.status).toBe(404)
          expect(res.body.message.includes('not found')).toBeTruthy()
          done()
        })
    })
  })

  // Delete a specific movie
  describe('DELETE /movies/:id', () => {
    test('If the movie exists, delete it', (done) => {
      const [dummyMovie] = dummyMovies

      Movie.create(dummyMovie)
        .then((movie) => {
          request(app)
            .delete(`${basePath}/${movie.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(204)
              expect(res.body).toEqual({})

              Movie.findByPk(movie.id)
                .then((movie) => {
                  expect(movie).toBeNull()
                  done()
                })
                .catch((err) => done(err))
            })
        })
        .catch((err) => done(err))
    })

    test('If the movie does not exist, return status 404', (done) => {
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
