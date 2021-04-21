import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { AccountModel } from '@domain/models'
import { PasswordRecoveryUseCase } from './password-recovery-usecase'
import { UserError } from '@errors/user-error'

interface SutTypes {
  sut: PasswordRecoveryUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return {
        id: '123',
        name: 'any name',
        email,
        password: 'any_password',
      }
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new PasswordRecoveryUseCase(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}


describe('PasswordRecoveryUseCase', () => {

  const givenEmail = 'any@email.com'

  it('should call LoadAccountByEmailRepository with correct params', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.recover(givenEmail)

    expect(loadByEmailSpy).toBeCalledWith(givenEmail)
  })

  it('should not handle LoadAccountByEmailRepository internal errors', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(givenError)

    await expect(() => sut.recover(givenEmail)).rejects.toThrow(givenError)
  })

  it('should throw an UserError if the account does not exists', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)

    const expectedError = new UserError('There is no account with the provied Email')
    await expect(() => sut.recover(givenEmail)).rejects.toThrow(expectedError)
  })


})
