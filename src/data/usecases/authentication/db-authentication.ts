import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '@domain/usecases'
import { AuthenticationError } from '@errors/authentication-error'

export class DbAuthentication implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private hashComparer: HashComparer,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (!account)
      throw new AuthenticationError()

    const isPasswordCorrect = await this.hashComparer.compare(credentials.password, account.password)

    return ''
  }

}
