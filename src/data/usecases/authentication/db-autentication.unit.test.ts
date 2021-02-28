import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '@domain/models'
import { AuthenticationModel } from '@domain/usecases'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const givenEmail = 'any_email@mail.com'
const givenPassword = 'any_password'

const makeCredentials = (): AuthenticationModel => ({
  email: givenEmail,
  password: givenPassword,
})

const makeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: givenEmail,
  password: givenPassword,
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(): Promise<AccountModel> {
      return makeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication UseCase', () => {

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeCredentials())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })

  it('should not handle LoadAccountByEmailRepository errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(givenError)
    await expect(() => sut.auth(makeCredentials())).rejects.toThrow(givenError)
  })

})
