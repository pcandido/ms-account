import { MongoHelper } from '../src/gateways/helpers/mogodb-helper'
import { S3Mock } from '../test/mocks/s3'
import amqplib from 'amqplib'
import mockAmqplib from 'mock-amqplib'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  await S3Mock.init(4569)
  amqplib.connect = mockAmqplib.connect
})

afterAll(async () => {
  await MongoHelper.close()
  await S3Mock.close()
})
