import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '../helpers/mogodb-helper'

describe('AccountRepository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  it('should return an account on success', async () => {
    const givenAccount = {
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const sut = new AccountMongoRepository()
    const added = await sut.add(givenAccount)

    expect(added).toEqual({ ...givenAccount, id: expect.anything() })
  })

})
