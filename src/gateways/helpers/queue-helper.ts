import { Connection, Channel, connect } from 'amqplib'

export const QueueHelper = {

  connection: null as Connection | null,
  channel: null as Channel | null,

  async connect(messageBrokerHost: string) {
    this.connection = await connect(`amqp://${messageBrokerHost}`)
    this.channel = await this.connection.createChannel()
  },

  async close() {
    await this.channel?.close()
    await this.connection?.close()
    this.channel = this.connection = null
  },

  async sendMessage(queue: string, message: any): Promise<void> {
    await this.channel?.assertQueue(queue)
    await this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
  },

  async getMessage(queue: string): Promise<Buffer | false> {
    await this.channel?.assertQueue(queue)
    const message = await this.channel?.get(queue)

    if (message)
      return message.content
    return false
  },

}
