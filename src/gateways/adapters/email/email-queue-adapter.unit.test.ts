import { connect, sendToQueue } from 'amqplib'
import { EmailMessage } from '@usecases/protocols/email/email-sender'
import { EmailQueueAdapter } from './email-queue-adapter'

jest.mock('amqplib', () => {
  const assertQueue = jest.fn()
  const sendToQueue = jest.fn()
  const createChannel = jest.fn().mockResolvedValue({ assertQueue, sendToQueue })
  const connect = jest.fn().mockResolvedValue({ createChannel })

  return { connect, createChannel, assertQueue, sendToQueue }
})

const givenRabbitmqHost = 'amqp://localhost'
const givenQueue = 'any_queue'

const makeSut = (): EmailQueueAdapter => new EmailQueueAdapter(givenRabbitmqHost)

const makeEmailMessage = (): EmailMessage => ({
  to: 'any@email.com',
  subject: 'any subject',
  body: 'any body',
})

describe('EmailQueueAdapter', () => {

  it('should call amqplib.connect with correct params', async () => {
    const sut = makeSut()

    await sut.send(makeEmailMessage())

    expect(connect).toBeCalledWith(givenRabbitmqHost)
  })

  it.skip('should call amqplib with correct params', async () => {
    const sut = makeSut()

    await sut.send(makeEmailMessage())

    expect(sendToQueue).toBeCalledWith(givenQueue, Buffer.from(JSON.stringify(makeEmailMessage())))
  })

})
