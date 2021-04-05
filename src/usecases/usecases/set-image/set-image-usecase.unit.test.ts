import { SetImageUsecase } from './set-image-usecase'
import { AccountPublicModel } from '@domain/models'
import { ImageResizer } from '@usecases/protocols/image/image-resizer'
import { ImagePersister } from '@usecases/protocols/image/image-persister'
import { UpdateAccountRepository } from '@usecases/protocols/account/update-account-repository'
import { AccountModel, ImageSet } from '@domain/models'

interface SutTypes {
  sut: SetImageUsecase
  imageResizerStub: ImageResizer
  imagePersisterStub: ImagePersister
  updateAccountRepositoryStub: UpdateAccountRepository
}

const givenAccountId = '123'
const makeImageBuffer = (): Buffer => Buffer.from('original', 'utf-8')
const makeAccount = (): AccountPublicModel => ({ id: givenAccountId, name: 'any name', email: 'any@email.com' })
const makeResizedBuffer = (width, height) => Buffer.from(`${width}x${height}`)
const makePersistedImageSet = (): ImageSet => ({ uri: 'https://original', uri64: 'https://64x64', uri256: 'https://256x256' })

const makeImageResizerStub = (): ImageResizer => {
  class ImageResizerStub implements ImageResizer {
    async resize(image: Buffer, width: number, height: number): Promise<Buffer> {
      return makeResizedBuffer(width, height)
    }
  }
  return new ImageResizerStub()
}

const makeImagePersisterStub = (): ImagePersister => {
  class ImagePersisterStub implements ImagePersister {
    async persist(accountId: string, buffer: Buffer): Promise<string> {
      return `https://${buffer.toString()}`
    }
  }
  return new ImagePersisterStub()
}

const makeUpdateAccountRepositoryStub = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateAccount(): Promise<void> {
      /* do nothing */
    }
  }
  return new UpdateAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const imageResizerStub = makeImageResizerStub()
  const imagePersisterStub = makeImagePersisterStub()
  const updateAccountRepositoryStub = makeUpdateAccountRepositoryStub()
  const sut = new SetImageUsecase(imageResizerStub, imagePersisterStub, updateAccountRepositoryStub)
  return { sut, imageResizerStub, imagePersisterStub, updateAccountRepositoryStub }
}

describe('SetImageUsecase', () => {

  it('should call ImageResizer with correct params', async () => {
    const { sut, imageResizerStub } = makeSut()
    const resizeSpy = jest.spyOn(imageResizerStub, 'resize')
    await sut.setImage(makeAccount(), makeImageBuffer())
    expect(resizeSpy).toHaveBeenCalledWith(makeImageBuffer(), 64, 64)
    expect(resizeSpy).toHaveBeenCalledWith(makeImageBuffer(), 256, 256)
  })

  it('should not handle ImageResizer internal errors', async () => {
    const { sut, imageResizerStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(imageResizerStub, 'resize').mockRejectedValueOnce(givenError)
    await expect(() => sut.setImage(makeAccount(), makeImageBuffer())).rejects.toThrow(givenError)
  })

  it('should call ImagePersister with correct params', async () => {
    const { sut, imagePersisterStub } = makeSut()
    const persistSpy = jest.spyOn(imagePersisterStub, 'persist')
    await sut.setImage(makeAccount(), makeImageBuffer())
    expect(persistSpy).toBeCalledWith(givenAccountId, makeImageBuffer())
    expect(persistSpy).toBeCalledWith(givenAccountId, makeResizedBuffer(64, 64))
    expect(persistSpy).toBeCalledWith(givenAccountId, makeResizedBuffer(256, 256))
  })

  it('should not handle ImagePersister internal errors', async () => {
    const { sut, imagePersisterStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(imagePersisterStub, 'persist').mockRejectedValueOnce(givenError)
    await expect(() => sut.setImage(makeAccount(), makeImageBuffer())).rejects.toThrow(givenError)
  })

  it('should call UpdateAccountRepository with correct params', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'updateAccount')
    await sut.setImage(makeAccount(), makeImageBuffer())
    expect(updateSpy).toBeCalledWith(givenAccountId, { image: makePersistedImageSet() })
  })

  it('should not handle UpdateAccountRepository internal errors', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(updateAccountRepositoryStub, 'updateAccount').mockRejectedValueOnce(givenError)
    await expect(() => sut.setImage(makeAccount(), makeImageBuffer())).rejects.toThrow(givenError)
  })

  it('should return the persisted URIs on success', async () => {
    const { sut } = makeSut()
    const result = await sut.setImage(makeAccount(), makeImageBuffer())
    expect(result).toEqual(makePersistedImageSet())
  })

})
