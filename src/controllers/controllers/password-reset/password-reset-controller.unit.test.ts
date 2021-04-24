import { ValidationError } from '@controllers/errors'
import { Request, Validator } from '@controllers/protocols'
import { PasswordReset } from '@domain/usecases'
import { ServerError } from '@errors/server-error'
import { PasswordResetController } from './password-reset-controller'

interface SutTypes {
  sut: PasswordResetController
  validatorStub: Validator
  passwordResetStub: PasswordReset
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate() { /* do nothing */ }
  }

  return new ValidatorStub()
}

const makePasswordResetStub = (): PasswordReset => {
  class PasswordResetStub implements PasswordReset {
    async reset() { /* do nothing */ }
  }

  return new PasswordResetStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const passwordResetStub = makePasswordResetStub()
  const sut = new PasswordResetController(validatorStub, passwordResetStub)
  return { sut, validatorStub, passwordResetStub }
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

  it('should call PasswordReset usecase with correct params', async () => {
    const { sut, passwordResetStub } = makeSut()
    const recoverySpy = jest.spyOn(passwordResetStub, 'reset')

    await sut.handle(makeRequest())

    expect(recoverySpy).toBeCalledWith(givenToken, givenPassword)
  })

  it('should return server error if PasswordReset usecase throws internal error', async () => {
    const { sut, passwordResetStub } = makeSut()
    const givenError = new Error('any errror')
    jest.spyOn(passwordResetStub, 'reset').mockRejectedValueOnce(givenError)

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 500, body: new ServerError(givenError) })
  })

  it('should return status code 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual({ statusCode: 200, body: {} })
  })

})
