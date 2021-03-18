import { TokenSet } from '@domain/models'
import { Authentication } from '@domain/usecases'
import { AuthenticationError } from '@controllers/errors/authentication-error'
import { ValidationError } from '@controllers/errors/validation-error'
import { badRequest, serverError, unauthorized, ok } from '@controllers/helpers/http-helper'
import { Validator } from '@controllers/protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validatorStub: Validator
}

const givenTokens: TokenSet = { accessToken: 'accessToken', refreshToken: 'refreshToken' }

const makeValidator = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeAuthentication = () => {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<TokenSet> {
      return givenTokens
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub, validatorStub)
  return { sut, authenticationStub: authenticationStub, validatorStub }
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
    const { sut, authenticationStub: authenticationStub } = makeSut()
    const givenRequest = makeRequest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(givenRequest)
    expect(authSpy).toBeCalledWith({ email: givenEmail, password: givenPassword })
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub: authenticationStub } = makeSut()
    const givenRequest = makeRequest()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValue(null)

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(unauthorized(new AuthenticationError()))
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub: authenticationStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('any error')
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(givenError)

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const givenRequest = makeRequest()

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(ok(givenTokens))
  })

})
