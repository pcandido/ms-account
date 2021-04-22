import amqplib from 'amqplib'
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

const givenRabbitmqHost = 'localhost'
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
    expect(amqplib.connect).toBeCalledWith(`amqp://${givenRabbitmqHost}`)
  })

  it('should call connection.createChannel', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect((amqplib as any).createChannel).toBeCalled()
  })

  it('should call channel.assertQueue with correct queue name', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect((amqplib as any).assertQueue).toBeCalledWith(givenQueue)
  })

  it('should call channel.sendToQueue with correct params', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect((amqplib as any).sendToQueue).toBeCalledWith(givenQueue, Buffer.from(JSON.stringify(makeEmailMessage())))
  })

  it('should call channel.close', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect((amqplib as any).channelClose).toBeCalled()
  })

  it('should call connection.close', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect((amqplib as any).connectionClose).toBeCalled()
  })

  it.each([
    ['connect', amqplib.connect],
    ['createChannel', (amqplib as any).createChannel],
    ['assertQueue', (amqplib as any).assertQueue],
    ['sendToQueue', (amqplib as any).sendToQueue],
    ['channel.close', (amqplib as any).channelClose],
    ['connection.close', (amqplib as any).connectionClose],
  ])('should not handle %s internal errors', async (methodName, method) => {
    const sut = makeSut()
    const givenError = new Error('any error')
    method.mockRejectedValueOnce(givenError)

    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

})
