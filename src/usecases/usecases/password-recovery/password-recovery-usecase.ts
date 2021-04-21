import { PasswordRecovery } from '@domain/usecases'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'

export class PasswordRecoveryUseCase implements PasswordRecovery{

  constructor(
    private loadAccountByEmailRepositry: LoadAccountByEmailRepository,
  ){}

  async recover(email: string): Promise<void> {
    await this.loadAccountByEmailRepositry.loadByEmail(email)

  }

}
