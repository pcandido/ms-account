import { MissingParamError } from '@presentation/errors'
import { refreshTokenValidator } from './refresh-token-validator'

const makeSut = () => refreshTokenValidator()

describe('RefreshTokenValidator', () => {

  it('should throw if no refreshToken is provided', async () => {
    const sut = makeSut()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('refreshToken'))
  })

  it('should not throw if no validator throws', () => {
    const sut = makeSut()
    const givenRequest = { refreshToken: 'any_refresh_token' }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
