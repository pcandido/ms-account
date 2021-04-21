import { HashComparer } from '@usecases/protocols/cryptography/hash-comparer'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { TokenSet } from '@domain/models'
import { Authentication, AuthenticationModel } from '@domain/usecases'

export class AuthenticationUseCase implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashComparer: HashComparer,
    private tokenSetGenerator: TokenSetGenerator,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<TokenSet | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)
    if (!account)
      return null

    const isPasswordCorrect = await this.hashComparer.compare(credentials.password, account.password)
    if (!isPasswordCorrect)
      return null

    const { password, ...accountWithoutPassword } = account
    const token = this.tokenSetGenerator.generateSet(accountWithoutPassword, credentials.remember)
    return token
  }

}
