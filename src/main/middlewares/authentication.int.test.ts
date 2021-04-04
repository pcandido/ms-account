import request from 'supertest'
import app from '@main/config/app'

describe('Authentication Middleware', () => {

  it('should not set account to request if no authorization header is provided', async () => {
    const givenRoute = '/authenticated_route_without_authorization'

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .expect('')
  })

  it('should set account to request if token is invalid', async () => {
    const givenRoute = '/authenticated_route_with_invalid_token'

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6MzI0NzIxNDQwMDB9.mMETHx3ChcoqsD7_piWoGrJZ88eACPxlJJqC84Z415k')
      .expect('')
  })

  it('should set account to request if token is not an accessToken', async () => {
    const givenRoute = '/authenticated_route_with_invalid_token_type'

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiZW1haWwiOiJ2YWxpZEBtYWlsLmNvbSIsImlhdCI6OTQ2NjkyMDAwLCJleHAiOjMyNDcyMTQ0MDAwfQ.GK37sN9Xinnd3HVjtQ5LT0bhhBXaO1e2SxeDLahCi84')
      .expect('')
  })

  it('should set account to request if not all information were provided into token', async () => {
    const givenRoute = '/authenticated_route_with_invalid_token_type'

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6MzI0NzIxNDQwMDB9.mMETHx3ChcoqsD7_piWoGrJZ88eACPXlJJqC84Z415k')
      .expect('')
  })

  it('should chain the requests with account attribute', async () => {
    const givenRoute = '/authenticated_route'
    const expectedBody = { id: '123', name: 'any name', email: 'valid@mail.com' }

    app.get(givenRoute, (req, res) => {
      res.send(req.account)
    })

    await request(app)
      .get(givenRoute)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpZCI6IjEyMyIsIm5hbWUiOiJhbnkgbmFtZSIsImVtYWlsIjoidmFsaWRAbWFpbC5jb20iLCJpYXQiOjk0NjY5MjAwMCwiZXhwIjozMjQ3MjE0NDAwMH0.FVxr-iFByo3N59NxpPn7yWu4-7PZXpbh5_aIhKSHJ-g')
      .expect(expectedBody)
  })

})

