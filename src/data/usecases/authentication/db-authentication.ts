import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { TokenSet } from '@domain/models'
import { Authentication, AuthenticationModel } from '@domain/usecases'

export class DbAuthentication implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<TokenSet | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)
    if (!account)
      return null

    const isPasswordCorrect = await this.hashComparer.compare(credentials.password, account.password)
    if (!isPasswordCorrect)
      return null

    const { password, ...accountWithoutPassword } = account
    const token = this.tokenGenerator.generate(accountWithoutPassword)
    return token
  }

}
