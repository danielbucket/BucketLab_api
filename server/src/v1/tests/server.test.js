const request = require('supertest')
const server = require('../server.js')

afterEach(done => done())

describe('Sanity check', () => {
  test('1 should equal 1', () => {
    expect(1).toEqual(1)
  })
})

describe('GET /', () => {
  test('should return 200 OK', async () => {
    const res = await request(server).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      message: 'BucketLab API'
    })
  })
})