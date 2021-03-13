import { RefreshTokenController } from './refresh-token'
import { Validator } from '@presentation/protocols'
import { badRequest, serverError } from '@presentation/helpers/http-helper'
import { ValidationError } from '@presentation/errors/validation-error'
import { RefreshToken } from '@domain/usecases'
import { TokenSet } from '@domain/models'

interface SutTypes {
  sut: RefreshTokenController
  validatorStub: Validator
  refreshTokenStub: RefreshToken
}

const givenGeneratedAccessToken = 'access-token'
const givenGeneratedRefreshToken = 'refresh-token'

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeRefreshTokenStub = () => {
  class RefreshTokenStub implements RefreshToken {
    async refresh(): Promise<TokenSet> {
      return {
        accessToken: givenGeneratedAccessToken,
        refreshToken: givenGeneratedRefreshToken,
      }
    }
  }

  return new RefreshTokenStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const refreshTokenStub = makeRefreshTokenStub()
  const sut = new RefreshTokenController(validatorStub, refreshTokenStub)
  return { sut, validatorStub, refreshTokenStub }
}

describe('Refresh Token Controller', () => {

  it('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenToken = { refreshToken: 'refresh_token' }
    await sut.handle({ body: givenToken })
    expect(validateSpy).toBeCalledWith(givenToken)
  })

  it('should return badRequest if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new ValidationError('any error')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })
    const response = await sut.handle({ body: {} })
    expect(response).toEqual(badRequest(givenError))
  })

  it('should return error 500 if validator throws an internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })
    const response = await sut.handle({ body: {} })
    expect(response).toEqual(serverError(givenError))
  })

  it('should call RefreshToken with correct values', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const refreshSpy = jest.spyOn(refreshTokenStub, 'refresh')
    const givenToken = 'token'
    sut.handle({ body: { refreshToken: givenToken } })
    expect(refreshSpy).toBeCalledWith(givenToken)
  })

})
