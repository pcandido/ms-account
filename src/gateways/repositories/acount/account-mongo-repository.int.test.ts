import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'

describe('AccountMongoRepository', () => {

  let accountsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  const makeSut = () => new AccountMongoRepository()
  const givenEmail = 'account-mongo-repository@mail.com'
  const makeAccount = () => ({
    name: 'any name',
    email: givenEmail,
    password: 'any_password',
  })

  describe('addAcount', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const added = await sut.addAccount(makeAccount())

      expect(added).toEqual({ ...makeAccount(), id: expect.anything() })
    })
  })

  describe('updateAccount', () => {
    it('should update account on database', async () => {
      const sut = makeSut()
      const id = await (await accountsCollection.insertOne(makeAccount())).insertedId

      const givenNewName = 'updated name'
      await sut.updateAccount(id, { name: givenNewName })
      const updated = await accountsCollection.findOne({ _id: id })

      expect(updated).toEqual({ ...makeAccount(), _id: id, name: givenNewName })
    })
  })

  describe('loadByEmail', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne(makeAccount())

      const account = await sut.loadByEmail(givenEmail)
      expect(account).toEqual({ ...makeAccount(), id: expect.anything() })
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('unexistent_email@mail.com')
      expect(account).toBeNull()
    })
  })

})
