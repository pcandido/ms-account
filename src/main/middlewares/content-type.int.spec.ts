import request from 'supertest'
import app from '@main/config/app'

describe('ContentType Middleware', () => {

  it('should return default ContentType as json', async () => {
    const givenRoute = '/content_type_route'

    app.get(givenRoute, (req, res) => {
      res.send('')
    })

    await request(app)
      .get(givenRoute)
      .expect('Content-Type', /json/)
  })

  it('should return ContentType as text when forced', async () => {
    const givenRoute = '/content_type_text_route'

    app.get(givenRoute, (req, res) => {
      res.type('text')
      res.send('')
    })

    await request(app)
      .get(givenRoute)
      .expect('Content-Type', /text/)
  })

})

