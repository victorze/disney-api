const request = require('supertest')
const { app, server } = require('../../src/server')
const db = require('../../src/models')

const Character = db.Character

const characters = [
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
  beforeEach((done) => {
    Character.destroy({ truncate: true }).then(() => done())
  })

  afterAll(() => {
    server.close()
  })

  describe('GET /api/characters/:id', () => {
    const [character] = characters

    test('Character exist', (done) => {
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
