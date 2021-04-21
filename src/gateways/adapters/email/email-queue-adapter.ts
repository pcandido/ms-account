import { EmailMessage, EmailSender } from '@usecases/protocols/email/email-sender'
import { connect } from 'amqplib'

export class EmailQueueAdapter implements EmailSender {

  constructor(
    private rabbitmqHost: string,
  ) { }

  async send(message: EmailMessage): Promise<void> {
    const connection = await connect(this.rabbitmqHost)
    await connection.createChannel()
  }

}
