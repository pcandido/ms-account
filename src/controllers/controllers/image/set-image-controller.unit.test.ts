import { Validator, Request, MultiPartFile } from '@controllers/protocols'
import { ValidationError } from '@controllers/errors/validation-error'
import { SetImageController } from './set-image-controller'
import { badRequest, serverError } from '@controllers/helpers/http-helper'

interface SutTypes {
  sut: SetImageController
  validatorStub: Validator
}

const makeValidator = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const sut = new SetImageController(validatorStub)
  return { sut, validatorStub }
}

const givenAccount = {
  id: '123',
  name: 'any name',
  email: 'any@email.com',
}

const makeImage = (): MultiPartFile => ({
  originalName: 'any_name',
  size: 500,
  encoding: 'utf-8',
  mimeType: 'image/jpg',
  buffer: Buffer.from('any_image', 'utf-8'),
})

const makeRequest = (): Request => ({
  body: {
    image: makeImage(),
  },
  account: givenAccount,
})

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


})
