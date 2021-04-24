import { ValidationError } from '@controllers/errors'
import { Request, Validator } from '@controllers/protocols'
import { ServerError } from '@errors/server-error'
import { PasswordResetController } from './password-reset-controller'

interface SutTypes {
  sut: PasswordResetController
  validatorStub: Validator
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate() { /* do nothing */ }
  }

  return new ValidatorStub()
}


const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new PasswordResetController(validatorStub)
  return { sut, validatorStub }
}

const givenToken = 'any.token'
const givenPassword = 'any password'

const makeBody = () => ({
  token: givenToken,
  password: givenPassword,
  passwordConfirmation: givenPassword,
})
const makeRequest = (): Request => ({
  body: makeBody(),
})

describe('PasswordResetController', () => {

  it('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')

    await sut.handle(makeRequest())

    expect(validateSpy).toBeCalledWith(makeBody())
  })

  it('should return bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new ValidationError('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 400, body: givenError })
  })

  it('should return server error if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 500, body: new ServerError(givenError) })
  })

})
