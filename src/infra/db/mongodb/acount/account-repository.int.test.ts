import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '../helpers/mogodb-helper'

describe('AccountMongoRepository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('collections')
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  const makeSut = () => new AccountMongoRepository()

  it('should return an account on success', async () => {
    const givenAccount = {
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const sut = makeSut()
    const added = await sut.add(givenAccount)

    expect(added).toEqual({ ...givenAccount, id: expect.anything() })
  })

})
