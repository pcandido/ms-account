import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '@domain/usecases'
import { AuthenticationError } from '@errors/authentication-error'

export class DbAuthentication implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (!account)
      throw new AuthenticationError()

    const isPasswordCorrect = await this.hashComparer.compare(credentials.password, account.password)
    if (!isPasswordCorrect)
      throw new AuthenticationError()

    const { password, ...accountWithoutPassword } = account

    const token = await this.tokenGenerator.generate(accountWithoutPassword)

    return ''
  }

}
