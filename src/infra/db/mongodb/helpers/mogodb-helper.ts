import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect(url: string | undefined): Promise<void> {
    if (!url) {
      throw new Error('Invalid MongoDB URL')
    }

    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },
  async close(): Promise<void> {
    await this.client?.close()
  },
  getCollection(name: string): Collection {
    const collection = this.client?.db().collection(name)
    if (!collection) {
      throw new Error(`Unknkown collection: ${name}`)
    }
    return collection
  },
}
