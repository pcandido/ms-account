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

describe('Login Controller', () => {

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

})
