const request = require('supertest')
const { app, server } = require('../../src/server')
const db = require('../../src/models')

const characters = [
  {
    name: 'Jane',
    age: 33,
    weight: 88.5,
    story: "Jane's story",
    image: 'Jane image link',
  },
  {
    name: 'Joe',
    age: 40,
    weight: 70,
    story: "Joe's story",
    image: 'Joe image link',
  },
]

describe('characters', () => {
  beforeEach((done) => {
    db.sequelize.sync({ force: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  describe('GET /api/characters/:id', () => {
    const [character] = characters

    test('Character exist', (done) => {
      db.Character.create(character)
        .then((data) => {
          request(app)
            .get('/api/characters/1')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.name).toEqual(data.name)
              expect(res.body.age).toEqual(data.age)
              expect(res.body.weight).toEqual(data.weight)
              expect(res.body.story).toEqual(data.story)
              expect(res.body.image).toEqual(data.image)
              done()
            })
        })
        .catch((err) => done(err))
    })

    test('Character does not exist', (done) => {
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
