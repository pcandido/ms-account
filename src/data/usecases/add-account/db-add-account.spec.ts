import { Encrypter } from '@data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount', () => {

  interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter
  }

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }

    return new EncrypterStub()
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return { sut, encrypterStub }
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

})
