import { MongoHelper } from '../src/gateways/helpers/mogodb-helper'
import { S3Mock } from '../test/mocks/s3'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  await S3Mock.init(4569)
})

afterAll(async () => {
  await MongoHelper.close()
  await S3Mock.close()
})
