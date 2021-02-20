import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect(url: string | undefined): Promise<void> {
    if (!url) {
      throw new Error('Invalid MongoDB URL')
    }

    this.client = await new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },
  async close(): Promise<void> {
    await this.client?.close()
  },
}
