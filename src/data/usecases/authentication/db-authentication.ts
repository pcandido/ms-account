import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '@domain/usecases'

export class DbAuthentication implements Authentication {

  constructor(
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) { }

  async auth(credentials: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(credentials.email)


    return ''
  }

}
