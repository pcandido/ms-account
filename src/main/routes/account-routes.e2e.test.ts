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

})

