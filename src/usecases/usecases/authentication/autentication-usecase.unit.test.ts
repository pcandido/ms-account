import { HashComparer } from '@usecases/protocols/cryptography/hash-comparer'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { AccountModel, TokenSet } from '@domain/models'
import { AuthenticationModel } from '@domain/usecases'
import { AuthenticationUseCase } from './authentication-usecase'

interface SutTypes {
  sut: AuthenticationUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenSetGeneratorStub: TokenSetGenerator
}

const givenId = 'any_id'
const givenName = 'any name'
const givenEmail = 'any_email@mail.com'
const givenPassword = 'any_password'
const givenHashedPassword = 'hashed_password'
const givenToken: TokenSet = { accessToken: 'accessToken', refreshToken: 'refreshToken' }

const makeCredentials = (): AuthenticationModel => ({
  email: givenEmail,
  password: givenPassword,
  remember: true,
})

const makeAccount = (): AccountModel => ({
  id: givenId,
  name: givenName,
  email: givenEmail,
  password: givenHashedPassword,
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel> {
      return makeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparatorStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeTokenSetGeneratorStub = (): TokenSetGenerator => {
  class TokenSetGeneratorStub implements TokenSetGenerator {
    generateSet(): TokenSet {
      return givenToken
    }
  }
  return new TokenSetGeneratorStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparatorStub()
  const tokenSetGeneratorStub = makeTokenSetGeneratorStub()
  const sut = new AuthenticationUseCase(loadAccountByEmailRepositoryStub, hashComparerStub, tokenSetGeneratorStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenSetGeneratorStub: tokenSetGeneratorStub }
}

describe('AuthenticationUseCase', () => {

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeCredentials())
    expect(loadSpy).toBeCalledWith(givenEmail)
  })

  it('should not handle LoadAccountByEmailRepository errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(givenError)
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

  it('should return null if no account is found', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const response = await sut.auth(makeCredentials())
    expect(response).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeCredentials())
    expect(compareSpy).toBeCalledWith(givenPassword, givenHashedPassword)
  })

  it('should not handle HashComparer errors', async () => {
    const { sut, hashComparerStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(givenError)
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

  it('should throw AuthenticationError if password is incorrect', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const response = await sut.auth(makeCredentials())
    expect(response).toBeNull()
  })

  it('should call TokenSetGenerator with correct values', async () => {
    const { sut, tokenSetGeneratorStub: tokenSetGeneratorStub } = makeSut()
    const generateSetSpy = jest.spyOn(tokenSetGeneratorStub, 'generateSet')
    await sut.auth(makeCredentials())
    expect(generateSetSpy).toBeCalledWith({
      id: givenId,
      name: givenName,
      email: givenEmail,
    }, true)
  })

  it('should not handle TokenSetGenerator errors', async () => {
    const { sut, tokenSetGeneratorStub: tokenSetGeneratorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenSetGeneratorStub, 'generateSet').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

  it('should return the generated token', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeCredentials())
    expect(token).toBe(givenToken)
  })

})
