import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'

describe('SignUp Routes', () => {

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('collections')
    await accountsCollection.deleteMany({})
  })

  it('should return an account on success', async () => {
    const givenRoute = '/api/signup'

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

