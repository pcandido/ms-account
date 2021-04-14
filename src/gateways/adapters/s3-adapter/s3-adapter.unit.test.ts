import AWS from 'aws-sdk'
import { S3Adapter } from './s3-adapter'

jest.mock('aws-sdk', () => {
  const uploadFn = jest.fn()
    .mockReturnValue({
      promise() {
        return Promise.resolve({
          Location: 'http://location',
        })
      },
    })

  class S3 {
    public upload: jest.Mock
    constructor() {
      this.upload = uploadFn
    }
  }

  class Endpoint { }

  return { S3, Endpoint, uploadFn }
})

const givenFileName = 'any_file_name'
const givenBucketName = 'any_bucket_name'
const makeBuffer = () => Buffer.from('content')

const makeSut = (): S3Adapter => {
  return new S3Adapter(
    'any_access_key',
    'any_secret_access_key',
    'https://any.endpoint',
    givenBucketName,
  )
}

describe('S3Adapter', () => {

  it('should call S3.upload with correct params', async () => {
    const sut = makeSut()
    const uploadSpy = jest.spyOn(AWS as any, 'uploadFn')
    await sut.persist(givenFileName, makeBuffer())
    expect(uploadSpy).toBeCalledWith({
      Key: givenFileName,
      Bucket: givenBucketName,
      Body: makeBuffer(),
    })
  })

  it('should not handle S3.upload internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(AWS as any, 'uploadFn').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.persist(givenFileName, makeBuffer())).rejects.toThrow(givenError)
  })

  it('should return the uploaded file link', async () => {
    const sut = makeSut()
    const result = await sut.persist(givenFileName, makeBuffer())
    expect(result).toBe('http://location')
  })

})
