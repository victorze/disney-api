const request = require('supertest')
const { app, server } = require('../src/server')
const db = require('../src/models')

const User = db.User
const Movie = db.Movie
const basePath = '/movies'

process.env.JWT_SECRET = 'secret'

const dummyMovies = [
  {
    title: 'The Lion King',
    releaseDate: new Date(1994, 6, 8).toISOString(),
    rating: '5',
    image: '/images/movies/the-lion-king.png',
  },
  {
    title: '101 Dalmatians',
    releaseDate: new Date(1961, 0, 25).toISOString(),
    rating: '4',
    image: '/images/movies/101-dalmatians.png',
  },
]

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
    Movie.destroy({ truncate: true }).then(() => done())
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
        .then(() => {
          request(app)
            .get(basePath)
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body).toHaveLength(2)

              const [movie] = res.body
              expect(Object.keys(movie)).toHaveLength(4)
              expect(movie.id).toBeDefined()
              expect(movie.title).toBeDefined()
              expect(movie.releaseDate).toBeDefined()
              expect(movie.image).toBeDefined()
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
})
