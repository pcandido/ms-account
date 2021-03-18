import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/db/account/load-account-by-email-repository'
import { AccountModel, TokenSet } from '@domain/models'
import { DbRefreshToken } from './db-refresh-token'

interface SutTypes {
  sut: DbRefreshToken
  tokenDecoderStub: TokenDecoder
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  tokenGeneratorStub: TokenGenerator
}

const givenRefreshToken = 'refresh_token'
const givenEmail = 'valid@email.com'
const givenId = 'any_id'
const givenName = 'any_name'

const makeAccount = (): AccountModel => ({
  id: givenId,
  name: givenName,
  email: givenEmail,
  password: 'hashed_password',
})

const makeTokenSet = () => ({
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
})

const makeTokenDecoderStub = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    decode(): any {
      return {
        email: givenEmail,
        tokenType: 'refresh',
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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate(): TokenSet {
      return makeTokenSet()
    }
  }
  return new TokenGeneratorStub()
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = makeTokenDecoderStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const sut = new DbRefreshToken(tokenDecoderStub, loadAccountByEmailRepositoryStub, tokenGeneratorStub)
  return { sut, tokenDecoderStub, loadAccountByEmailRepositoryStub, tokenGeneratorStub }
}

describe('DbAuthentication UseCase', () => {

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

  it('should return null if TokenDecoder returns null', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce(null)
    const result = await sut.refresh(givenRefreshToken)
    expect(result).toBeNull()
  })

  it('should return null if the token is not of type refresh', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce({ tokenType: 'access' })
    const result = await sut.refresh(givenRefreshToken)
    expect(result).toBeNull()
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

  it('should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.refresh(givenRefreshToken)
    expect(generateSpy).toBeCalledWith({
      id: givenId,
      name: givenName,
      email: givenEmail,
    })
  })

  it('should not handle TokenGenerator internal errors', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenRefreshToken)).rejects.toThrow(givenError)
  })

  it('should return the generated tokens on success', async () => {
    const { sut } = makeSut()
    const result = await sut.refresh(givenRefreshToken)
    expect(result).toEqual(makeTokenSet())
  })

})
