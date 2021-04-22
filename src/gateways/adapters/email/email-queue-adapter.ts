import { EmailMessage, EmailSender } from '@usecases/protocols/email/email-sender'
import { connect } from 'amqplib'

export class EmailQueueAdapter implements EmailSender {

  constructor(
    private rabbitmqHost: string,
    private queueName: string,
  ) { }

  async send(message: EmailMessage): Promise<void> {
    const connection = await connect(this.rabbitmqHost)
    const channel = await connection.createChannel()
    await channel.assertQueue(this.queueName)
    await channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)))
    await channel.close()

  }

}
