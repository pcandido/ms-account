import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { DbRefreshToken } from './db-refresh-token'

interface SutTypes {
  sut: DbRefreshToken
  tokenVerifierStub: TokenVerifier
}

const givenRefreshToken = 'refresh_token'

const makeTokenVerifierStub = (): TokenVerifier => {
  class TokenVerifierStub implements TokenVerifier {
    verify(): boolean {
      return true
    }
  }

  return new TokenVerifierStub()
}

const makeSut = (): SutTypes => {
  const tokenVerifierStub = makeTokenVerifierStub()
  const sut = new DbRefreshToken(tokenVerifierStub)
  return { sut, tokenVerifierStub }
}

describe('DbAuthentication UseCase', () => {

  it('should call TokenVerifier with correct value', async () => {
    const { sut, tokenVerifierStub } = makeSut()
    const verifySpy = jest.spyOn(tokenVerifierStub, 'verify')
    await sut.refresh(givenRefreshToken)
    expect(verifySpy).toBeCalledWith(givenRefreshToken)
  })



})
