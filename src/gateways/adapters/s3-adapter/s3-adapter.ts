import { ImagePersister } from '@usecases/protocols/image/image-persister'
import AWS from 'aws-sdk'

export class S3Adapter implements ImagePersister {

  private client: AWS.S3;

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    endpoint: string,
    private bucketName: string,
  ) {
    this.client = new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId,
      secretAccessKey,
      endpoint: new AWS.Endpoint(endpoint),
    })
  }

  async persist(fileName: string, imageBuffer: Buffer): Promise<string> {
    const result = await this.client.upload({
      Key: fileName,
      Bucket: this.bucketName,
      Body: imageBuffer,
    }).promise()

    return result.Location
  }

}
