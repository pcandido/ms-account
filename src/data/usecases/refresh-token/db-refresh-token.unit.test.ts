import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { DbRefreshToken } from './db-refresh-token'

interface SutTypes {
  sut: DbRefreshToken
  tokenVerifierStub: TokenVerifier
  tokenDecoderStub: TokenDecoder
}

const givenRefreshToken = 'refresh_token'
const givenEmail = 'valid@email.com'

const makeTokenVerifierStub = (): TokenVerifier => {
  class TokenVerifierStub implements TokenVerifier {
    verify(): boolean {
      return true
    }
  }

  return new TokenVerifierStub()
}

const makeTokenDecoderStub = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    decode(): any {
      return {
        email: givenEmail,
      }
    }
  }

  return new TokenDecoderStub()
}

const makeSut = (): SutTypes => {
  const tokenVerifierStub = makeTokenVerifierStub()
  const tokenDecoderStub = makeTokenDecoderStub()
  const sut = new DbRefreshToken(tokenVerifierStub, tokenDecoderStub)
  return { sut, tokenVerifierStub, tokenDecoderStub }
}

describe('DbAuthentication UseCase', () => {

  it('should call TokenVerifier with correct value', async () => {
    const { sut, tokenVerifierStub } = makeSut()
    const verifySpy = jest.spyOn(tokenVerifierStub, 'verify')
    await sut.refresh(givenRefreshToken)
    expect(verifySpy).toBeCalledWith(givenRefreshToken)
  })

  it('should return null if TokenVerifier returns false', async () => {
    const { sut, tokenVerifierStub } = makeSut()
    jest.spyOn(tokenVerifierStub, 'verify').mockReturnValue(false)
    const result = await sut.refresh(givenRefreshToken)
    expect(result).toBeNull()
  })

  it('should not handle TokenVerifier internal errors', async () => {
    const { sut, tokenVerifierStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenVerifierStub, 'verify').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenRefreshToken)).rejects.toThrow(givenError)
  })

  it('should call TokenDecoder with correct value', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const decodeSpy = jest.spyOn(tokenDecoderStub, 'decode')
    await sut.refresh(givenRefreshToken)
    expect(decodeSpy).toBeCalledWith(givenRefreshToken)
  })

  it('should not handle TokenDecoder internal errors', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenDecoderStub, 'decode').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenRefreshToken)).rejects.toThrow(givenError)
  })


})
