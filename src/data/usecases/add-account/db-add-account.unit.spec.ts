import { AccountModel } from '@domain/models/account'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@data/protocols/add-account-repository'
import { Encrypter } from '@data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository,
}

const givenGeneratedId = 'generatedId'
const givenHashedPassword = 'hashed_password'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve(givenHashedPassword)
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const addedAccount = { ...account, id: givenGeneratedId }
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

const makeAccount = () => ({
  account: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  } as AddAccountModel,
  with(key: keyof AddAccountModel, value: string) {
    this.account[key] = value
    return this
  },
  build() {
    return this.account
  },
})

describe('DbAddAccount', () => {

  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const givenPassword = 'any_password'
    const givenAccount = makeAccount().with('password', givenPassword).build()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(givenAccount)
    expect(encryptSpy).toHaveBeenCalledWith(givenPassword)
  })

  it('should not handle Encrypter errors', async () => {
    const { sut, encrypterStub } = makeSut()
    const givenAccount = makeAccount().build()
    const givenError = new Error('some error')
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount().build()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(givenAccount)
    expect(addSpy).toHaveBeenCalledWith({ ...givenAccount, password: givenHashedPassword })
  })

  it('should not handle AddAccountRepository errors', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount().build()
    const givenError = new Error('some error')
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should return the added account on success', async () => {
    const { sut } = makeSut()
    const givenAccount = makeAccount().build()

    const added = await sut.add(givenAccount)
    expect(added).toEqual({ ...makeAccount().build(), password: givenHashedPassword, id: givenGeneratedId })
  })

})
