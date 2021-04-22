import { connect, createChannel, sendToQueue, assertQueue, channelClose, connectionClose } from 'amqplib'
import { EmailMessage } from '@usecases/protocols/email/email-sender'
import { EmailQueueAdapter } from './email-queue-adapter'

jest.mock('amqplib', () => {
  const assertQueue = jest.fn()
  const sendToQueue = jest.fn()
  const connectionClose = jest.fn()
  const channelClose = jest.fn()
  const createChannel = jest.fn().mockResolvedValue({ assertQueue, sendToQueue, close: channelClose })
  const connect = jest.fn().mockResolvedValue({ createChannel, close: connectionClose })

  return { connect, createChannel, assertQueue, sendToQueue, channelClose, connectionClose }
})

const givenRabbitmqHost = 'amqp://localhost'
const givenQueue = 'any_queue'

const makeSut = (): EmailQueueAdapter => new EmailQueueAdapter(givenRabbitmqHost, givenQueue)

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

  it('should call connection.createChannel', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(createChannel).toBeCalled()
  })

  it('should call channel.assertQueue with correct queue name', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(assertQueue).toBeCalledWith(givenQueue)
  })

  it('should call channel.sendToQueue with correct params', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(sendToQueue).toBeCalledWith(givenQueue, Buffer.from(JSON.stringify(makeEmailMessage())))
  })

  it('should call channel.close', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(channelClose).toBeCalled()
  })

  it('should call connection.close', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(connectionClose).toBeCalled()
  })

  it.each([
    ['connect', connect],
    ['createChannel', createChannel],
    ['assertQueue', assertQueue],
    ['sendToQueue', sendToQueue],
    ['channel.close', channelClose],
    ['channel.close', channelClose],
  ])('should not handle %s internal errors', async (methodName, method) => {
    const sut = makeSut()
    const givenError = new Error('any error')
    method.mockRejectedValueOnce(givenError)

    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

})
