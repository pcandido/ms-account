import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const givenSecretPhrase = 'secret_phrase'
const givenPayload = { field1: 1, field2: '2' }
const generatedToken = 'generated_token'
const givenRefreshToken = 'refresh_token'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return generatedToken
  },
  verify(): boolean {
    return true
  },
}))

const makeSut = (): JwtAdapter => new JwtAdapter(givenSecretPhrase)

describe('JwtAdapter', () => {

  describe('generate method', () => {
    it('should call sign with correct values', () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.generate(givenPayload)
      expect(signSpy).toHaveBeenNthCalledWith(1, { ...givenPayload, tokenType: 'access' }, givenSecretPhrase, { expiresIn: expect.anything() })
      expect(signSpy).toHaveBeenNthCalledWith(2, { ...givenPayload, tokenType: 'refresh' }, givenSecretPhrase, { expiresIn: expect.anything() })
    })

    it('should return the jwt result', () => {
      const sut = makeSut()
      const generatedAccessToken = 'accessToken'
      const generatedRefreshToken = 'refreshToken'
      jest.spyOn(jwt, 'sign')
        .mockImplementationOnce(() => generatedAccessToken)
        .mockImplementationOnce(() => generatedRefreshToken)

      const token = sut.generate(givenPayload)

      expect(token).toEqual({
        accessToken: generatedAccessToken,
        refreshToken: generatedRefreshToken,
      })
    })

    it('should not handle Jwt errors', () => {
      const sut = makeSut()
      const givenError = new Error('any_error')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw givenError })
      expect(() => sut.generate(givenPayload)).toThrow(givenError)
    })
  })

  describe('verify method', () => {
    it('should call jwt.verify with correct value', () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.verify(givenRefreshToken)
      expect(verifySpy).toBeCalledWith(givenRefreshToken, givenSecretPhrase)
    })
  })

})
