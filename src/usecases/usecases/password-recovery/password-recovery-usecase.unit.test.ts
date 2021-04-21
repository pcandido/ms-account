import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { EmailSender, EmailMessage } from '@usecases/protocols/email/email-sender'
import { AccountModel } from '@domain/models'
import { PasswordRecoveryUseCase } from './password-recovery-usecase'
import { UserError } from '@errors/user-error'
import fs from 'fs'

interface SutTypes {
  sut: PasswordRecoveryUseCase
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  tokenGeneratorStub: TokenGenerator
  emailSenderStub: EmailSender
}

const expiresInMinutes = 60 * 24
const givenName = 'Any Name'
const givenRecoveryLink = 'https://domain.com/recover'
const generatedToken = 'generated.token'

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return {
        id: '123',
        name: givenName,
        email,
        password: 'any_password',
      }
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate(data: any, expiresInMinutes: number): string {
      return generatedToken
    }
  }

  return new TokenGeneratorStub()
}

const makeEmailSenderStub = (): EmailSender => {
  class EmailSenderStub implements EmailSender {
    async send(message: EmailMessage): Promise<void> {
      /* do nothing' */
    }
  }

  return new EmailSenderStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const emailSenderStub = makeEmailSenderStub()
  const sut = new PasswordRecoveryUseCase(
    loadAccountByEmailRepositoryStub,
    tokenGeneratorStub,
    emailSenderStub,
    expiresInMinutes,
    'subject_file',
    'template_file',
    givenRecoveryLink,
  )
  return { sut, loadAccountByEmailRepositoryStub, tokenGeneratorStub, emailSenderStub }
}


describe('PasswordRecoveryUseCase', () => {

  const givenEmail = 'any@email.com'

  beforeEach(() => {
    const files = {
      subject_file: 'subject',
      template_file: '{{name}},{{link}}',
    }

    jest.spyOn(fs, 'readFile')
      .mockImplementation((path, callback) => {
        callback(null, Buffer.from(files[path.toString()]))
      })
  })

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

  it('should call tokenGenerator with correct params', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.recover(givenEmail)

    expect(generateSpy).toBeCalledWith({ email: givenEmail }, expiresInMinutes)
  })

  it('should not handle TokenGenerator internal errors', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => { throw givenError })

    await expect(() => sut.recover(givenEmail)).rejects.toThrow(givenError)
  })

  it('should call emailSender with correct params', async () => {
    const { sut, emailSenderStub } = makeSut()
    const link = `${givenRecoveryLink}?token=${generatedToken}`
    const sendSpy = jest.spyOn(emailSenderStub, 'send')

    await sut.recover(givenEmail)

    expect(sendSpy).toBeCalledWith({
      to: givenEmail,
      subject: 'subject',
      body: `${givenName},${link}`,
    })
  })


})
