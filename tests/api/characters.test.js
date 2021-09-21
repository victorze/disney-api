const request = require('supertest')
const { app, server } = require('../../src/server')

describe('characters', () => {
  beforeEach(() => {
    // console.log('foo')
  })

  afterAll(() => {
    server.close()
  })

  describe('GET /api/characters', () => {
    it('foo', (done) => {
      request(app)
        .get('/api/characters')
        .end((err, res) => {
          expect(res.status).toBe(200)
          expect(res.text.includes('baz')).toBe(true)
          done()
        })
    })
  })
})
