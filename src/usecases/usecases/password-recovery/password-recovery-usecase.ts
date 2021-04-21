import { PasswordRecovery } from '@domain/usecases'
import { UserError } from '@errors/user-error'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'

export class PasswordRecoveryUseCase implements PasswordRecovery {

  constructor(
    private loadAccountByEmailRepositry: LoadAccountByEmailRepository,
    private tokenGenerator: TokenGenerator,
    private tokenExpiresInMinutes: number,
  ) { }

  async recover(email: string): Promise<void> {
    const account = await this.loadAccountByEmailRepositry.loadByEmail(email)
    if (!account)
      throw new UserError('There is no account with the provied Email')

    this.tokenGenerator.generate({ email }, this.tokenExpiresInMinutes)

  }

}
