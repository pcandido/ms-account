import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '@domain/models'
import { DbRefreshToken } from './db-refresh-token'

interface SutTypes {
  sut: DbRefreshToken
  tokenVerifierStub: TokenVerifier
  tokenDecoderStub: TokenDecoder
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const givenRefreshToken = 'refresh_token'
const givenEmail = 'valid@email.com'

const makeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: givenEmail,
  password: 'hashed_password',
})

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

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel> {
      return makeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const tokenVerifierStub = makeTokenVerifierStub()
  const tokenDecoderStub = makeTokenDecoderStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbRefreshToken(tokenVerifierStub, tokenDecoderStub, loadAccountByEmailRepositoryStub)
  return { sut, tokenVerifierStub, tokenDecoderStub, loadAccountByEmailRepositoryStub }
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

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.refresh(givenRefreshToken)
    expect(loadSpy).toBeCalledWith(givenEmail)
  })

  it('should return null if no account is found', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const response = await sut.refresh(givenRefreshToken)
    expect(response).toBeNull()
  })

  it('should not handle LoadAccountByEmailRepository internal errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenRefreshToken)).rejects.toThrow(givenError)
  })

})
