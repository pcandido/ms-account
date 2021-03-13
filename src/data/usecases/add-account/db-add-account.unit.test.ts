import { AccountModel } from '@domain/models/account'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { Hasher } from '@data/protocols/cryptography/hasher'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount,
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository,
}

const givenGeneratedId = 'generatedId'
const givenHashedPassword = 'hashed_password'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return Promise.resolve(givenHashedPassword)
    }
  }

  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async addAccount(account: AddAccountModel): Promise<AccountModel> {
      const addedAccount = { ...account, id: givenGeneratedId }
      return Promise.resolve(addedAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub: hasherStub, addAccountRepositoryStub }
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

  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const givenPassword = 'any_password'
    const givenAccount = makeAccount().with('password', givenPassword).build()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(givenAccount)
    expect(hashSpy).toHaveBeenCalledWith(givenPassword)
  })

  it('should not handle Hasher errors', async () => {
    const { sut, hasherStub } = makeSut()
    const givenAccount = makeAccount().build()
    const givenError = new Error('some error')
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount().build()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')

    await sut.add(givenAccount)
    expect(addSpy).toHaveBeenCalledWith({ ...givenAccount, password: givenHashedPassword })
  })

  it('should not handle AddAccountRepository errors', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount().build()
    const givenError = new Error('some error')
    jest.spyOn(addAccountRepositoryStub, 'addAccount').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should return the added account on success', async () => {
    const { sut } = makeSut()
    const givenAccount = makeAccount().build()

    const added = await sut.add(givenAccount)
    expect(added).toEqual({ ...makeAccount().build(), password: givenHashedPassword, id: givenGeneratedId })
  })

})
