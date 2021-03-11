import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/update-access-token-repository'
import { Authentication, AuthenticationModel } from '@domain/usecases'

export class DbAuthentication implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
    private updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (!account)
      return null

    const isPasswordCorrect = await this.hashComparer.compare(credentials.password, account.password)
    if (!isPasswordCorrect)
      return null

    const { password, ...accountWithoutPassword } = account
    const token = await this.tokenGenerator.generate(accountWithoutPassword)
    this.updateAccessTokenRepository.update(account.id, token)
    return token
  }

}
