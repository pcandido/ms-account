import { Authenticator } from '@domain/usecases'
import { InvalidParamError, MissingParamError, AuthenticationError } from '@presentation/errors'
import { badRequest, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { EmailValidator } from '@presentation/protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticatorStub: Authenticator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthenticator = () => {
  class AuthenticatorStub implements Authenticator {
    async auth(): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(emailValidatorStub, authenticatorStub)
  return { sut, emailValidatorStub, authenticatorStub }
}

interface LoginBody {
  email: string
  password: string
}

const makeRequest = () => ({
  request: {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    } as LoginBody,
  },

  with(key: keyof LoginBody, value: string) {
    this.request.body[key] = value
    return this
  },

  without(key: keyof LoginBody) {
    delete this.request.body[key]
    return this
  },

  build(): { body: Partial<LoginBody> } {
    return this.request
  },
})

describe('Login Controller', () => {

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeRequest().without('email').build()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeRequest().without('password').build()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenEmail = 'any_email@mail.com'
    const httpRequest = makeRequest().with('email', givenEmail).build()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(givenEmail)
  })

  it('should return 400 if provided email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeRequest().build()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeRequest().build()
    const givenError = new Error('any error')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => { throw givenError })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(givenError))
  })

  it('should call authentication with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const givenEmail = 'any_email@mail.com'
    const givenPassword = 'any_password'
    const httpRequest = makeRequest()
      .with('email', givenEmail)
      .with('password', givenPassword)
      .build()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    await sut.handle(httpRequest)
    expect(authSpy).toBeCalledWith(givenEmail, givenPassword)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    const httpRequest = makeRequest().build()
    const givenError = new AuthenticationError()
    jest.spyOn(authenticatorStub, 'auth').mockRejectedValueOnce(givenError)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized(givenError))
  })

})
