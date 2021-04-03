import { RefreshTokenController } from './refresh-token'
import { Validator, Request } from '@controllers/protocols'
import { badRequest, ok, serverError, unauthorized } from '@controllers/helpers/http-helper'
import { ValidationError } from '@controllers/errors/validation-error'
import { RefreshToken } from '@domain/usecases'
import { TokenSet } from '@domain/models'
import { AuthenticationError } from '@controllers/errors/authentication-error'

interface SutTypes {
  sut: RefreshTokenController
  validatorStub: Validator
  refreshTokenStub: RefreshToken
}

const givenRefreshToken = 'refreshToken'
const generatedAccessToken = 'access-token'
const generatedRefreshToken = 'refresh-token'
const givenAccount = {
  id: '123',
  name: 'any name',
  email: 'valid@email.com',
}

const makeRequest = (): Request => ({
  body: {
    refreshToken: givenRefreshToken,
  },
  account: givenAccount,
})

const makeTokenSet = () => ({
  accessToken: generatedAccessToken,
  refreshToken: generatedRefreshToken,
})

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
      return makeTokenSet()
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
    const givenBody = { refreshToken: givenRefreshToken }
    await sut.handle({ body: givenBody, account: givenAccount })
    expect(validateSpy).toBeCalledWith(givenBody)
  })

  it('should return badRequest if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new ValidationError('any error')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })
    const response = await sut.handle({ body: {}, account: givenAccount })
    expect(response).toEqual(badRequest(givenError))
  })

  it('should return error 500 if validator throws an internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(givenError))
  })

  it('should call RefreshToken with correct values', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const refreshSpy = jest.spyOn(refreshTokenStub, 'refresh')
    sut.handle(makeRequest())
    expect(refreshSpy).toBeCalledWith(givenAccount, givenRefreshToken)
  })

  it('should return 401 if RefreshToken returns null', async () => {
    const { sut, refreshTokenStub } = makeSut()
    jest.spyOn(refreshTokenStub, 'refresh').mockResolvedValueOnce(null)
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(unauthorized(new AuthenticationError('Refresh Token is expired or invalid')))
  })

  it('should not handle RefreshToken errors', async () => {
    const { sut, refreshTokenStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(refreshTokenStub, 'refresh').mockRejectedValueOnce(givenError)
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(givenError))
  })

  it('should return the new generated token set', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(ok(makeTokenSet()))
  })

})
