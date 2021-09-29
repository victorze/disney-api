const request = require('supertest')
const { app, server } = require('../src/server')

describe('Error handler', () => {
  afterAll(() => {
    server.close()
  })

  test('If the resource does not exist return 404', (done) => {
    request(app)
      .get('/foo/bar')
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.message).toBe('There is nothing here')
        done()
      })
  })
})
