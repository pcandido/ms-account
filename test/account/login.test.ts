import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'

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
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
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

