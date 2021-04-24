import { MongoHelper } from '../src/gateways/helpers/mogodb-helper'
import { QueueHelper } from '../src/gateways/helpers/queue-helper'
import { S3Mock } from '../test/mocks/s3'
import amqplib from 'amqplib'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mockAmqplib from 'mock-amqplib'

beforeAll(async () => {
  amqplib.connect = mockAmqplib.connect
  await MongoHelper.connect(process.env.MONGO_URL)
  await QueueHelper.connect('localhost')
  await S3Mock.init(4569)
})

afterAll(async () => {
  await MongoHelper.close()
  await QueueHelper.close()
  await S3Mock.close()
})
