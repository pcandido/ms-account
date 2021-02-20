import request from 'supertest'
import app from '@main/config/app'

describe('BodyParser Middleware', () => {

  it('should parser body as json', async () => {
    const givenRoute = '/body_parser_route'
    const givenBody = {
      field1: 1,
      field2: '2',
    }

    app.post(givenRoute, (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post(givenRoute)
      .send(givenBody)
      .expect(givenBody)
  })

})

