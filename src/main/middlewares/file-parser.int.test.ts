import request from 'supertest'
import app from '@main/config/app'
import path from 'path'

describe('FileParser Middleware', () => {

  it('should parse a file part of body', async (done) => {
    const givenRoute = '/single_file_parser_route'

    app.post(givenRoute, (req, res) => {
      res.send(req.body)
    })

    request(app)
      .post(givenRoute)
      .attach('file', path.join(__dirname, '..', '..', '..', 'test', 'fixtures', 'file.txt'))
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toEqual({
          file: {
            originalName: 'file.txt',
            size: 8,
            mimeType: 'text/plain',
            buffer: expect.anything(),
          },
        })
        done()
      })
  })

})

