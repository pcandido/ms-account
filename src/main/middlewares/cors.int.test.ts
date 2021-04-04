import request from 'supertest'
import app from '@main/config/app'

describe('Cors Middleware', () => {

  it('should enable CORS', async () => {
    const givenRoute = '/cors_route'

    app.get(givenRoute, (req, res) => {
      res.send()
    })

    await request(app)
      .get(givenRoute)
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Headers', '*')
      .expect('Access-Control-Allow-Methods', '*')
  })

})

