import { DbAddAccount } from './db-add-account'

describe('DbAddAccount', () => {

  it('should call Encrypter with correct password', async () => {

    const givenPassword = 'any_password'
    const givenAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: givenPassword,
    }

    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }

    const encrypterStub = new EncrypterStub()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const sut = new DbAddAccount(encrypterStub)
    await sut.add(givenAccount)

    expect(encryptSpy).toHaveBeenCalledWith(givenPassword)

  })

})
