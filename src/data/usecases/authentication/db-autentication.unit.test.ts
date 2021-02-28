import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '@domain/models'
import { AuthenticationModel } from '@domain/usecases'
import { AuthenticationError } from '@errors/authentication-error'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}

const givenEmail = 'any_email@mail.com'
const givenPassword = 'any_password'
const givenHashedPassword = 'hashed_password'

const makeCredentials = (): AuthenticationModel => ({
  email: givenEmail,
  password: givenPassword,
})

const makeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
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

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparatorStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
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
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(new AuthenticationError())
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
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(new AuthenticationError())
  })

})
