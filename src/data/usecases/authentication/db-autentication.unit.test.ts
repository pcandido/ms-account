import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/update-access-token-repository'
import { AccountModel } from '@domain/models'
import { AuthenticationModel } from '@domain/usecases'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const givenId = 'any_id'
const givenName = 'any name'
const givenEmail = 'any_email@mail.com'
const givenPassword = 'any_password'
const givenHashedPassword = 'hashed_password'
const givenToken = 'generated_token'

const makeCredentials = (): AuthenticationModel => ({
  email: givenEmail,
  password: givenPassword,
})

const makeAccount = (): AccountModel => ({
  id: givenId,
  name: givenName,
  email: givenEmail,
  password: givenHashedPassword,
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(): Promise<AccountModel> {
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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(): Promise<string> {
      return givenToken
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessToeknRepositoryStub = () => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update() {
      /* do nothing */
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparatorStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessToeknRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub }
}

describe('DbAuthentication UseCase', () => {

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeCredentials())
    expect(loadSpy).toBeCalledWith(givenEmail)
  })

  it('should not handle LoadAccountByEmailRepository errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(givenError)
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

  it('should throw AuthenticationError if no account is found', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
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

  it('should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeCredentials())
    expect(generateSpy).toBeCalledWith({
      id: givenId,
      name: givenName,
      email: givenEmail,
    })
  })

  it('should not handle TokenGenerator errors', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(givenError)
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

  it('should return the generated token', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeCredentials())
    expect(token).toBe(givenToken)
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeCredentials())
    expect(updateSpy).toBeCalledWith(givenId, givenToken)
  })

})
