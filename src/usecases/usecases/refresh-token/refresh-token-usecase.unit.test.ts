import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { AccountModel, TokenSet } from '@domain/models'
import { RefreshTokenUseCase } from './refresh-token-usecase'

interface SutTypes {
  sut: RefreshTokenUseCase
  tokenDecoderStub: TokenDecoder
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  tokenSetGeneratorStub: TokenSetGenerator
}

const givenRefreshToken = 'refresh_token'
const givenEmail = 'valid@email.com'
const givenId = 'any_id'
const givenName = 'any_name'
const givenRemember = true

const givenTokenAccount = {
  id: givenId,
  name: givenName,
  email: givenEmail,
}

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
        id: 'any_id',
        email: givenEmail,
        tokenType: 'refresh',
        remember: givenRemember,
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

const makeTokenSetGeneratorStub = (): TokenSetGenerator => {
  class TokenSetGeneratorStub implements TokenSetGenerator {
    generateSet(): TokenSet {
      return makeTokenSet()
    }
  }
  return new TokenSetGeneratorStub()
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = makeTokenDecoderStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const tokenSetGeneratorStub = makeTokenSetGeneratorStub()
  const sut = new RefreshTokenUseCase(tokenDecoderStub, loadAccountByEmailRepositoryStub, tokenSetGeneratorStub)
  return { sut, tokenDecoderStub, loadAccountByEmailRepositoryStub, tokenSetGeneratorStub }
}

describe('RefreshTokenUseCase', () => {

  it('should call TokenDecoder with correct value', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const decodeSpy = jest.spyOn(tokenDecoderStub, 'decode')
    await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(decodeSpy).toBeCalledWith(givenRefreshToken)
  })

  it('should not handle TokenDecoder internal errors', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenDecoderStub, 'decode').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenTokenAccount, givenRefreshToken)).rejects.toThrow(givenError)
  })

  it('should return null if TokenDecoder returns null', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce(null)
    const result = await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(result).toBeNull()
  })

  it('should return null if the token is not of type refresh', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce({ tokenType: 'access' })
    const result = await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(result).toBeNull()
  })

  it('should return null if the refresh and access tokens user ids are not equal', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce({ tokenType: 'refresh' })
    const givenIncorrectTokenAccount = { ...givenTokenAccount, id: 'other_id' }
    const result = await sut.refresh(givenIncorrectTokenAccount, givenRefreshToken)
    expect(result).toBeNull()
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(loadSpy).toBeCalledWith(givenEmail)
  })

  it('should return null if no account is found', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const response = await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(response).toBeNull()
  })

  it('should not handle LoadAccountByEmailRepository internal errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenTokenAccount, givenRefreshToken)).rejects.toThrow(givenError)
  })

  it.each([
    [true],
    [false],
  ])('should call TokenSetGenerator with correct values, including remember option %s', async (remember) => {
    const { sut, tokenDecoderStub, tokenSetGeneratorStub } = makeSut()

    const generateSetSpy = jest.spyOn(tokenSetGeneratorStub, 'generateSet')
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce({
      id: 'any_id',
      email: givenEmail,
      tokenType: 'refresh',
      remember,
    })

    await sut.refresh(givenTokenAccount, givenRefreshToken)

    expect(generateSetSpy).toBeCalledWith({
      id: givenId,
      name: givenName,
      email: givenEmail,
    }, remember)
  })

  it('should not handle TokenSetGenerator internal errors', async () => {
    const { sut, tokenSetGeneratorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenSetGeneratorStub, 'generateSet').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.refresh(givenTokenAccount, givenRefreshToken)).rejects.toThrow(givenError)
  })

  it('should return the generated tokens on success', async () => {
    const { sut } = makeSut()
    const result = await sut.refresh(givenTokenAccount, givenRefreshToken)
    expect(result).toEqual(makeTokenSet())
  })

})
