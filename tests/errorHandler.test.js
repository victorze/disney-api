const request = require('supertest')
const { app, server } = require('../src/server')

describe('Error handler', () => {
  afterAll(() => {
    server.close()
  })

  test('Not found', (done) => {
    request(app)
      .get('/api/foo')
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Aquí no hay nada.')
        done()
      })
  })
})
