import { QueueHelper } from '@gateways/helpers/queue-helper'
import { EmailMessage, EmailSender } from '@usecases/protocols/email/email-sender'

export class EmailQueueAdapter implements EmailSender {

  constructor(
    private queueName: string,
  ) { }

  async send(message: EmailMessage): Promise<void> {
    await QueueHelper.sendMessage(this.queueName, message)
  }

}
