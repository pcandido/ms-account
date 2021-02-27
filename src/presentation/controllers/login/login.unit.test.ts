import { MissingParamError } from '@presentation/errors'
import { badRequest } from '@presentation/helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
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

})
