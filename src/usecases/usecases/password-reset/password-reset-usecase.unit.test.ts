import { UserError } from '@errors/user-error'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { UpdateAccountRepository } from '@usecases/protocols/account/update-account-repository'
import { Hasher } from '@usecases/protocols/cryptography/hasher'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import { PasswordResetUseCase } from './password-reset-usecase'

interface SutTypes {
  sut: PasswordResetUseCase
  tokenDecoderStub: TokenDecoder
  loadAccoutByEmailStub: LoadAccountByEmailRepository
  hasherStub: Hasher
  updateAccountStub: UpdateAccountRepository
}

const givenId = '123'
const givenEmail = 'any@email.com'
const givenToken = 'any.token'
const givenPassword = 'any password'
const hashedPassword = 'hashed-password'

const makeAccount = () => ({
  id: givenId,
  name: 'any name',
  email: givenEmail,
  password: 'old_password',
})

const makeTokenDecoderStub = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    decode() {
      return { email: givenEmail }
    }
  }

  return new TokenDecoderStub()
}

const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailStub implements LoadAccountByEmailRepository {
    async loadByEmail() {
      return makeAccount()
    }
  }

  return new LoadAccountByEmailStub()
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return hashedPassword
    }
  }

  return new HasherStub()
}

const makeUpdateAccountStub = (): UpdateAccountRepository => {
  class UpdateAccountStub implements UpdateAccountRepository {
    async updateAccount(): Promise<void> {/* do nothing */ }
  }

  return new UpdateAccountStub()
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = makeTokenDecoderStub()
  const loadAccoutByEmailStub = makeLoadAccountByEmailStub()
  const hasherStub = makeHasherStub()
  const updateAccountStub = makeUpdateAccountStub()
  const sut = new PasswordResetUseCase(tokenDecoderStub, loadAccoutByEmailStub, hasherStub, updateAccountStub)
  return { sut, tokenDecoderStub, loadAccoutByEmailStub, hasherStub, updateAccountStub }
}

describe('PasswordResetUseCase', () => {

  it('should call TokenDecoder with correct params', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const decodeSpy = jest.spyOn(tokenDecoderStub, 'decode')
    await sut.reset(givenToken, givenPassword)

    expect(decodeSpy).toBeCalledWith(givenToken)
  })

  it('should not handle TokenDecoder internal errors', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(tokenDecoderStub, 'decode').mockImplementationOnce(() => { throw givenError })
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(givenError)
  })

  it('should throw invalid token if tokenDecoder returns null', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    jest.spyOn(tokenDecoderStub, 'decode').mockReturnValueOnce(null)
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(new UserError('Invalid or expired token'))
  })

  it('should call LoadAccountByEmailRepository with correct params', async () => {
    const { sut, loadAccoutByEmailStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccoutByEmailStub, 'loadByEmail')
    await sut.reset(givenToken, givenPassword)

    expect(loadByEmailSpy).toBeCalledWith(givenEmail)
  })

  it('should not handle TokenDecoder internal errors', async () => {
    const { sut, loadAccoutByEmailStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(loadAccoutByEmailStub, 'loadByEmail').mockRejectedValueOnce(givenError)
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(givenError)
  })

  it('should throw invalid account if account does not exist', async () => {
    const { sut, loadAccoutByEmailStub } = makeSut()
    jest.spyOn(loadAccoutByEmailStub, 'loadByEmail').mockResolvedValueOnce(null)
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(new UserError('Invalid Account'))
  })

  it('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.reset(givenToken, givenPassword)
    expect(hashSpy).toBeCalledWith(givenPassword)
  })

  it('should not handle hasher internal errors', async () => {
    const { sut, hasherStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(givenError)
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(givenError)
  })

  it('should call accountUpdater with correct vales', async () => {
    const { sut, updateAccountStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountStub, 'updateAccount')
    await sut.reset(givenToken, givenPassword)
    expect(updateSpy).toBeCalledWith(givenId, { password: hashedPassword })
  })

  it('should not handle accountUpdater internal errors', async () => {
    const { sut, updateAccountStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(updateAccountStub, 'updateAccount').mockRejectedValueOnce(givenError)
    await expect(() => sut.reset(givenToken, givenPassword)).rejects.toThrow(givenError)
  })

  it('should not handle any exception on success', async () => {
    const { sut } = makeSut()
    await sut.reset(givenToken, givenPassword)
  })

})
