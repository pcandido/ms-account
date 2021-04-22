import { connect, createChannel, sendToQueue, assertQueue } from 'amqplib'
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

  it('should not handle connect internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    connect.mockRejectedValueOnce(givenError)

    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

  it('should call connection.createChannel', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(createChannel).toBeCalled()
  })

  it('should not handle createChannel internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    createChannel.mockRejectedValueOnce(givenError)

    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

  it('should call channel.assertQueue with correct queue name', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(assertQueue).toBeCalledWith(givenQueue)
  })

  it('should not handle assertQueue internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    assertQueue.mockRejectedValueOnce(givenError)

    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

  it('should call channel.sendToQueue with correct params', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(sendToQueue).toBeCalledWith(givenQueue, Buffer.from(JSON.stringify(makeEmailMessage())))
  })

})
