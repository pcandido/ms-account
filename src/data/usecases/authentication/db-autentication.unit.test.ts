import { LoadAccountByEmailRepository } from '@data/protocols/load-account-by-email-repository'
import { AccountModel } from '@domain/models'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(): Promise<AccountModel> {
        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        }
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    })
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })

})
