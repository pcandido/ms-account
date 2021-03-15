import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'
import { Collection } from 'mongodb'

describe('SignUp Routes', () => {

  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    const givenRoute = '/api/signup'

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
    const givenRoute = '/api/login'

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
      }

      await request(app)
        .post(givenRoute)
        .send(givenCredentials)
        .expect(200)
    })
  })

  describe('POST /refresh-token', () => {
    const givenRoute = '/api/refresh-token'

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
        .send({})
        .expect(400)
    })

    it('should return 401 if provided token is invalid', async () => {
      await request(app)
        .post(givenRoute)
        .send({ refreshToken: 'invalid_token' })
        .expect(401)
    })

    it('should return 401 if provided token is expired', async () => {
      const givenExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiZW1haWwiOiJ2YWxpZEBtYWlsLmNvbSIsImlhdCI6OTQ2NjkyMDAwLCJleHAiOjk0NjY5MjAwMX0.hmzpNx5SAR6o7XY7TdJzjXHm10yFuGWC_h3HHj4tCcA'

      await request(app)
        .post(givenRoute)
        .send({ refreshToken: givenExpiredToken })
        .expect(401)
    })

    it('should return 200 and new tokens on success', async () => {
      const givenRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiZW1haWwiOiJ2YWxpZEBtYWlsLmNvbSIsImlhdCI6OTQ2NjkyMDAwLCJleHAiOjk1NjE3NTk0ODAwfQ.qR_SIX4vnwP7m6cY5G4cGjxueZdpbGjc_geuAmtWt_k'

      await request(app)
        .post(givenRoute)
        .send({ refreshToken: givenRefreshToken })
        .expect(200)
        .expect(/"accessToken" *: *"[a-zA-Z0-9-_.]+"/)
        .expect(/"refreshToken" *: *"[a-zA-Z0-9-_.]+"/)
    })
  })

})

