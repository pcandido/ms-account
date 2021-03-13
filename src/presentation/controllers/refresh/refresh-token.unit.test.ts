import { RefreshTokenController } from './refresh-token'
import { MissingParamError } from '@presentation/errors'
import { badRequest } from '@presentation/helpers/http-helper'

interface SutTypes {
  sut: RefreshTokenController
}

const makeSut = (): SutTypes => {
  const sut = new RefreshTokenController()
  return { sut }
}

describe('Refresh Token Controller', () => {

  it('should return 400 if no refresh-token is provided', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(badRequest(new MissingParamError('refreshToken')))
  })

})
