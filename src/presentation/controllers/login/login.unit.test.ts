import { Authenticator } from '@domain/usecases'
import { AuthenticationError, ValidationError } from '@presentation/errors'
import { badRequest, serverError, unauthorized, ok } from '@presentation/helpers/http-helper'
import { Validator } from '@presentation/helpers/validation/validator'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authenticator
  validatorStub: Validator
}

const givenToken = 'any_token'

const makeValidator = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeAuthenticator = () => {
  class AuthenticatorStub implements Authenticator {
    async auth(): Promise<string> {
      return givenToken
    }
  }

  return new AuthenticatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(authenticatorStub, validatorStub)
  return { sut, authenticatorStub, validatorStub }
}

const givenEmail = 'any_mail@main.com'
const givenPassword = 'password'

const makeRequest = () => ({
  body: {
    email: givenEmail,
    password: givenPassword,
  },
})

describe('Login Controller', () => {

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

  it('should call authentication with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const givenRequest = makeRequest()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    await sut.handle(givenRequest)
    expect(authSpy).toBeCalledWith(givenEmail, givenPassword)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new AuthenticationError()
    jest.spyOn(authenticatorStub, 'auth').mockRejectedValueOnce(givenError)

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(unauthorized(givenError))
  })

  it('should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('any error')
    jest.spyOn(authenticatorStub, 'auth').mockRejectedValueOnce(givenError)

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const givenRequest = makeRequest()

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(ok({ accessToken: givenToken }))
  })

})
