import { MongoHelper as sut } from './mogodb-helper'

describe('MongoHelper', () => {

  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.close()
  })

  it('should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy
    await sut.close()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy
  })

})
