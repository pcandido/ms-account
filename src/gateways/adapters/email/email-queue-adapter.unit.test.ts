import { QueueHelper } from '@gateways/helpers/queue-helper'
import { EmailMessage } from '@usecases/protocols/email/email-sender'
import { EmailQueueAdapter } from './email-queue-adapter'

jest.mock('../../helpers/queue-helper')

const givenQueue = 'any_queue'

const makeSut = (): EmailQueueAdapter => new EmailQueueAdapter(givenQueue)

const makeEmailMessage = (): EmailMessage => ({
  to: 'any@email.com',
  subject: 'any subject',
  body: 'any body',
})

describe('EmailQueueAdapter', () => {

  it('should call QueueHelper.sendMessage with correct params', async () => {
    const sut = makeSut()
    await sut.send(makeEmailMessage())
    expect(QueueHelper.sendMessage).toBeCalledWith(givenQueue, makeEmailMessage())
  })

  it('should not handle QueueHelper internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(QueueHelper, 'sendMessage').mockRejectedValueOnce(givenError)
    await expect(() => sut.send(makeEmailMessage())).rejects.toThrow(givenError)
  })

})
