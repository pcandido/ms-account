import { Validator, AuthenticatedRequest, MultiPartFile } from '@controllers/protocols'
import { ValidationError } from '@controllers/errors/validation-error'
import { SetImageController } from './set-image-controller'
import { badRequest, serverError, ok } from '@controllers/helpers/http-helper'
import { SetImage } from '@domain/usecases'
import { ImageSet } from '@domain/models'

interface SutTypes {
  sut: SetImageController
  validatorStub: Validator
  setImageStub: SetImage
}

const givenImageSet = {
  uri64: 'http://image.com/64',
  uri256: 'http://image.com/256',
  uri: 'http://image.com/',
}

const givenAccount = {
  id: '123',
  name: 'any name',
  email: 'any@email.com',
}

const makeImage = (): MultiPartFile => ({
  originalName: 'any_name',
  size: 500,
  mimeType: 'image/jpg',
  buffer: Buffer.from('any_image', 'utf-8'),
})

const makeRequest = (): AuthenticatedRequest => ({
  body: {
    image: makeImage(),
  },
  account: givenAccount,
})

const makeValidator = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeSetImageStub = () => {
  class SetImageStub implements SetImage {
    async setImage(): Promise<ImageSet> {
      return givenImageSet
    }
  }
  return new SetImageStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const setImageStub = makeSetImageStub()
  const sut = new SetImageController(validatorStub, setImageStub)
  return { sut, validatorStub, setImageStub }
}

describe('SetImageController', () => {

  it('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenRequest = makeRequest()

    await sut.handle(givenRequest)
    expect(validateSpy).toBeCalledWith(givenRequest.body)
  })

  it('should reuturn bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new ValidationError('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(badRequest(givenError))
  })

  it('should reuturn 500 if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should call SetImage with correct params', async () => {
    const { sut, setImageStub } = makeSut()
    const givenRequest = makeRequest()
    const setImageSpy = jest.spyOn(setImageStub, 'setImage')

    await sut.handle(givenRequest)
    expect(setImageSpy).toBeCalledWith(givenAccount, makeImage().buffer)
  })

  it('should return 500 if SetImage throws', async () => {
    const { sut, setImageStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(setImageStub, 'setImage').mockRejectedValueOnce(givenError)
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(serverError(givenError))
  })

  it('should return 200 and image set on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(ok(givenImageSet))
  })

})
