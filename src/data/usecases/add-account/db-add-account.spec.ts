import { AccountModel } from '@domain/models/account'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@data/protocols/add-account-repository'
import { Encrypter } from '@data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount', () => {

  interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository,
  }

  const givenHashedPassword = 'hashed_password'

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve(givenHashedPassword)
      }
    }

    return new EncrypterStub()
  }

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add(account: AddAccountModel): Promise<AccountModel> {
        const addedAccount = { ...account, id: 'generated_id' }
        return Promise.resolve(addedAccount)
      }
    }

    return new AddAccountRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return { sut, encrypterStub, addAccountRepositoryStub }
  }

  it('should call Encrypter with correct password', async () => {

    const givenPassword = 'any_password'
    const givenAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: givenPassword,
    }

    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(givenAccount)
    expect(encryptSpy).toHaveBeenCalledWith(givenPassword)

  })

  it('should not handle Encrypter errors', async () => {
    const givenAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }
    const givenError = new Error('some error')

    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should call AddAccountRepository with correct data', async () => {

    const givenAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(givenAccount)
    expect(addSpy).toHaveBeenCalledWith({ ...givenAccount, password: givenHashedPassword })

  })

  it('should not handle AddAccountRepository errors', async () => {
    const givenAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    }
    const givenError = new Error('some error')

    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

})
