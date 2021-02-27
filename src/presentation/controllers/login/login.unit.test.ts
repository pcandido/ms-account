import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { badRequest } from '@presentation/helpers/http-helper'
import { EmailValidator } from '@presentation/protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
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



})
