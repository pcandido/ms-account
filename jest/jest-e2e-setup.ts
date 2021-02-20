import { MongoHelper } from '../src/infra/db/mongodb/helpers/mogodb-helper'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.close()
})
