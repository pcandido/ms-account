import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'

describe('SignUp Routes', () => {

  beforeEach(async () => {
    const accountsCollection = MongoHelper.getCollection('collections')
    await accountsCollection.deleteMany({})
  })

  it('should return an account on success', async () => {
    const givenRoute = '/api/signup'

    const givenAccount = {
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any password',
      passwordConfirmation: 'any password',
    }

    await request(app)
      .post(givenRoute)
      .send(givenAccount)
      .expect(200)
  })

})

