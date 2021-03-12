import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '../helpers/mogodb-helper'
import { Collection } from 'mongodb'

describe('AccountMongoRepository', () => {

  let accountsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('collections')
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  const makeSut = () => new AccountMongoRepository()
  const makeAccount = () => ({
    name: 'any name',
    email: 'any_email@mail.com',
    password: 'any_password',
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const added = await sut.addAccount(makeAccount())

    expect(added).toEqual({ ...makeAccount(), id: expect.anything() })
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    const givenEmail = 'any_email@mail.com'
    accountsCollection.insertOne(makeAccount())

    const account = await sut.loadByEmail(givenEmail)
    expect(account).toEqual({ ...makeAccount(), id: expect.anything() })
  })

})
