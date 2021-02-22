import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {

  client: null as MongoClient | null,
  url: '' as string,

  async connect(url: string | undefined): Promise<void> {
    if (!url) {
      throw new Error('Invalid MongoDB URL')
    }

    this.url = url

    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },

  async close(): Promise<void> {
    await this.client?.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url)
    }

    const collection = this.client?.db().collection(name)
    if (!collection) {
      throw new Error(`Unknkown collection: ${name}`)
    }
    return collection
  },
}
