const request = require('supertest')
const server = require('../server.js')

describe('GET /api/account', () => {
  test('should return 200 OK', async () => {
    const res = await request(server).get('/api/v1/account')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      message: 'GET account'
    })
  })
})

describe('POST /api/v1/account/register', () => {
  test('should return 200 OK', async () => {
    const email = 'edward@abbey.mail'
    const res = await request(server)
    .post('/api/account/register')
    .send({
      email: email,
      password: 'password',
      firstName: 'Edward',
      lastName: 'Abbey',
      company: 'Monkey Wrench Gang',
      website: 'https://www.monkeywrenchgang.com'
    })
    .set('Accept', 'application/json')
    .set('Method', 'POST')
    .then(res => {
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toEqual(`You've registered a new account with ${email}`)
    })
  })
})