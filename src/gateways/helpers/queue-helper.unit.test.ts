import amqplib from 'amqplib'
import { QueueHelper } from './queue-helper'

jest.mock('amqplib', () => {
  const assertQueue = jest.fn()
  const sendToQueue = jest.fn()
  const connectionClose = jest.fn()
  const channelClose = jest.fn()
  const createChannel = jest.fn().mockResolvedValue({ assertQueue, sendToQueue, close: channelClose })
  const connect = jest.fn().mockResolvedValue({ createChannel, close: connectionClose })

  return { connect, createChannel, assertQueue, sendToQueue, channelClose, connectionClose }
})

describe('QueueHelper', () => {
  const givenHost = 'any_host'

  describe('connect', () => {

    it('should call connect with correct url', async () => {
      await QueueHelper.connect(givenHost)
      expect(amqplib.connect).toBeCalledWith(`amqp://${givenHost}`)
    })

    it('should call connection.createChannel', async () => {
      await QueueHelper.connect(givenHost)
      expect((amqplib as any).createChannel).toBeCalled()
    })

    it('should keep connection and channel in memory', async () => {
      await QueueHelper.connect(givenHost)
      expect(QueueHelper.connection).toBeTruthy()
      expect(QueueHelper.channel).toBeTruthy()
    })

  })

  describe('close', () => {

    beforeEach(async () => {
      await QueueHelper.connect(givenHost)
    })

    it('should call channel.close', async () => {
      await QueueHelper.close()
      expect((amqplib as any).channelClose).toBeCalled()
    })

    it('should call connection.close', async () => {
      await QueueHelper.close()
      expect((amqplib as any).connectionClose).toBeCalled()
    })

    it('should set null to connection and channel', async () => {
      await QueueHelper.close()
      expect(QueueHelper.connection).toBeFalsy()
      expect(QueueHelper.channel).toBeFalsy()
    })

  })

  describe('sendMessage', () => {

    const givenQueue = 'q1'
    const givenMessage = { field: 1 }

    beforeEach(async () => {
      await QueueHelper.connect(givenHost)
    })

    it('should call assertQueue with correct queue name', async () => {
      await QueueHelper.sendMessage(givenQueue, givenMessage)
      expect((amqplib as any).assertQueue).toBeCalledWith(givenQueue)
    })

    it('should call sendToQueue with correct params', async () => {
      await QueueHelper.sendMessage(givenQueue, givenMessage)
      expect((amqplib as any).sendToQueue).toBeCalledWith(givenQueue, Buffer.from(JSON.stringify(givenMessage)))
    })

  })

})
