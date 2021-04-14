/* eslint-disable @typescript-eslint/no-var-requires */
const FakeS3 = require('fake-s3')

export const S3Mock = {

  server: null as any,

  async init(port: number): Promise<void> {
    this.server = new FakeS3({
      port,
      buckets: ['account-image'],
      prefix: '',
    })

    await this.server?.bootstrap()
  },

  async close(): Promise<void> {
    this.server?.close()
  },
}
