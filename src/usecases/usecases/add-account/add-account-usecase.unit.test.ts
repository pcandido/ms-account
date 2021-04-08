import { AccountModel } from '@domain/models/account'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@usecases/protocols/account/add-account-repository'
import { Hasher } from '@usecases/protocols/cryptography/hasher'
import { AddAccountUseCase } from './add-account-usecase'

interface SutTypes {
  sut: AddAccountUseCase,
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
  const sut = new AddAccountUseCase(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub: hasherStub, addAccountRepositoryStub }
}

const makeAccount = (replace: Partial<AddAccountModel> = {}): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  ...replace,
})

describe('AddAccountUseCase', () => {

  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const givenPassword = 'any_password'
    const givenAccount = makeAccount({ password: givenPassword })
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(givenAccount)
    expect(hashSpy).toHaveBeenCalledWith(givenPassword)
  })

  it('should not handle Hasher errors', async () => {
    const { sut, hasherStub } = makeSut()
    const givenAccount = makeAccount()
    const givenError = new Error('some error')
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')

    await sut.add(givenAccount)
    expect(addSpy).toHaveBeenCalledWith({ ...givenAccount, password: givenHashedPassword })
  })

  it('should not handle AddAccountRepository errors', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const givenAccount = makeAccount()
    const givenError = new Error('some error')
    jest.spyOn(addAccountRepositoryStub, 'addAccount').mockRejectedValueOnce(givenError)

    await expect(() => sut.add(givenAccount)).rejects.toThrow(givenError)
  })

  it('should return the added account on success', async () => {
    const { sut } = makeSut()
    const givenAccount = makeAccount()

    const added = await sut.add(givenAccount)
    expect(added).toEqual({ ...makeAccount(), password: givenHashedPassword, id: givenGeneratedId })
  })

})
