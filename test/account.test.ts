import request from 'supertest'
import app from '@main/config/app'
import path from 'path'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection, ObjectId } from 'mongodb'

describe('SignUp Routes', () => {

  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    const givenRoute = '/signup'

    it('should fail on any error', async () => {
      const givenAccount = {
        name: 'any name',
        password: 'any password',
        passwordConfirmation: 'any password',
      }

      await request(app)
        .post(givenRoute)
        .send(givenAccount)
        .expect(400)
    })

    it('should return an account on success', async () => {
      const givenAccount = {
        name: 'any name',
        email: 'signup-routes@mail.com',
        password: 'any password',
        passwordConfirmation: 'any password',
      }

      await request(app)
        .post(givenRoute)
        .send(givenAccount)
        .expect(201)
    })
  })

  describe('POST /login', () => {
    const givenRoute = '/login'

    const givenEmail = 'valid@mail.com'
    const givenPassword = 'password'
    const givenHashedPassword = '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu'

    const givenAccount = {
      name: 'any name',
      email: givenEmail,
      password: givenHashedPassword,
    }

    beforeEach(async () => {
      await accountsCollection.insertOne(givenAccount)
    })

    it('should return 401 if provided email does not exists', async () => {
      const givenCredentials = {
        email: 'unexistent@mail.com',
        password: givenPassword,
        remember: false,
      }

      await request(app)
        .post(givenRoute)
        .send(givenCredentials)
        .expect(401)
    })

    it('should return 401 if provided password is incorrect', async () => {
      const givenCredentials = {
        email: givenEmail,
        password: 'invalid_password',
        remember: false,
      }

      await request(app)
        .post(givenRoute)
        .send(givenCredentials)
        .expect(401)
    })

    it('should return 200 if credentials are valid', async () => {
      const givenCredentials = {
        email: givenEmail,
        password: givenPassword,
        remember: false,
      }

      await request(app)
        .post(givenRoute)
        .send(givenCredentials)
        .expect(200)
    })
  })

  describe('POST /refresh-token', () => {
    const givenRoute = '/refresh-token'

    const givenAuthorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpZCI6IjEyMyIsIm5hbWUiOiJhbnkgbmFtZSIsImVtYWlsIjoidmFsaWRAbWFpbC5jb20iLCJpYXQiOjk0NjY5MjAwMCwiZXhwIjozMjQ3MjE0NDAwMH0.FVxr-iFByo3N59NxpPn7yWu4-7PZXpbh5_aIhKSHJ-g'
    const givenAccount = {
      name: 'any name',
      email: 'valid@mail.com',
      password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
    }

    beforeEach(async () => {
      await accountsCollection.insertOne(givenAccount)
    })

    it('should return 400 if no refresh-token is provided', async () => {
      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .send({})
        .expect(400)
    })

    it('should return 401 if provided token is invalid', async () => {
      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .send({ refreshToken: 'invalid_token' })
        .expect(401)
    })

    it('should return 401 if provided token is expired', async () => {
      const givenExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiZW1haWwiOiJ2YWxpZEBtYWlsLmNvbSIsImlhdCI6OTQ2NjkyMDAwLCJleHAiOjk0NjY5MjAwMX0.hmzpNx5SAR6o7XY7TdJzjXHm10yFuGWC_h3HHj4tCcA'

      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .send({ refreshToken: givenExpiredToken })
        .expect(401)
    })

    it('should return 200 and new tokens on success', async () => {
      const givenRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWQiOiIxMjMiLCJuYW1lIjoiYW55IG5hbWUiLCJlbWFpbCI6InZhbGlkQG1haWwuY29tIiwiaWF0Ijo5NDY2OTIwMDAsImV4cCI6OTU2MTc1OTQ4MDB9.5XhqpjOs6JIBrxGwGq7r-nTxkzqrJnO52KgpfK3XdJU'

      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .send({ refreshToken: givenRefreshToken })
        .expect(200)
        .expect(/"accessToken" *: *"[a-zA-Z0-9-_.]+"/)
        .expect(/"refreshToken" *: *"[a-zA-Z0-9-_.]+"/)
    })
  })

  describe('POST /set-image', () => {
    const givenRoute = '/set-image'

    const givenAuthorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpZCI6IjYwNmU2ODcwYzZiNDdiYzQ5ZjU1MWYxZSIsIm5hbWUiOiJhbnkgbmFtZSIsImVtYWlsIjoidmFsaWRAbWFpbC5jb20iLCJpYXQiOjk0NjY5MjAwMCwiZXhwIjozMjQ3MjE0NDAwMH0.BEyDozhXPI7ZleJPJU9P1RRj7CppGZpw_6pMCBx5gso'
    const givenAccount = {
      _id: new ObjectId('606e6870c6b47bc49f551f1e'),
      name: 'any name',
      email: 'valid@mail.com',
      password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
    }

    beforeEach(async () => {
      await accountsCollection.insertOne(givenAccount)
    })

    it('should return 401 if no authorization is provided', async () => {
      await request(app)
        .post(givenRoute)
        .attach('image', path.join(__dirname, 'fixtures', 'image.jpeg'))
        .expect(401)
    })

    it('should return 400 if no file is provided', async () => {
      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .send({})
        .expect(400)
        .expect({ message: 'Missing param: image' })
    })

    it('should return 400 if file is not an image', async () => {
      await request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .attach('image', path.join(__dirname, 'fixtures', 'file.txt'))
        .expect(400)
        .expect({ message: 'Invalid param: image' })
    })

    it('should return 200 on success', async done => {
      request(app)
        .post(givenRoute)
        .set('authorization', givenAuthorization)
        .attach('image', path.join(__dirname, 'fixtures', 'image.jpeg'))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          expect(res.body).toEqual({
            uri: expect.stringMatching(/^https?:\/\//),
            uri64: expect.stringMatching(/^https?:\/\/.+_64$/),
            uri256: expect.stringMatching(/^https?:\/\/.+_256$/),
          })

          done()
        })
    })

  })

})

