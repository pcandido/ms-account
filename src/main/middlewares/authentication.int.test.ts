import request from 'supertest'
import app from '@main/config/app'

describe('Authentication Middleware', () => {

  it('should not authenticate if path is public', async () => {
    const givenRoute = '/public/not_authenticated_route'
    const expectedBody = JSON.stringify({ message: 'ok' })

    app.get(givenRoute, (req, res) => {
      res.send(expectedBody)
    })

    await request(app)
      .get(givenRoute)
      .expect(expectedBody)
  })

  it('should return 401 when no Authorization is provided', async () => {
    const givenRoute = '/authenticated_route_without_authorization'

    app.get(givenRoute, (req, res) => {
      res.send('{"message":"ok"}')
    })

    await request(app)
      .get(givenRoute)
      .expect(401)
      .expect('Authorization header not provided')
  })

  it('should return 401 if token is invalid', async () => {
    const givenRoute = '/authenticated_route_with_invalid_token'

    app.get(givenRoute, (req, res) => {
      res.send('{"message":"ok"}')
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6MzI0NzIxNDQwMDB9.mMETHx3ChcoqsD7_piWoGrJZ88eACPxlJJqC84Z415k')
      .expect(401)
      .expect('invalid signature')
  })

  it('should chain the requests with user attribute', async () => {
    const givenRoute = '/authenticated_route'
    const expectedBody = { email: 'valid@mail.com' }

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6MzI0NzIxNDQwMDB9.mMETHx3ChcoqsD7_piWoGrJZ88eACPXlJJqC84Z415k')
      .expect(200)
      .expect(expectedBody)
  })

})

