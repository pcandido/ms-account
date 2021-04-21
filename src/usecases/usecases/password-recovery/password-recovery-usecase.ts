import { PasswordRecovery } from '@domain/usecases'
import { UserError } from '@errors/user-error'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'

export class PasswordRecoveryUseCase implements PasswordRecovery {

  constructor(
    private loadAccountByEmailRepositry: LoadAccountByEmailRepository,
  ) { }

  async recover(email: string): Promise<void> {
    const account = await this.loadAccountByEmailRepositry.loadByEmail(email)
    if (!account)
      throw new UserError('There is no account with the provied Email')


  }

}
