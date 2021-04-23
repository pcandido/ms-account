import request from 'supertest'
import { Collection } from 'mongodb'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'

describe('POST /signup', () => {

  const givenRoute = '/signup'
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

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

