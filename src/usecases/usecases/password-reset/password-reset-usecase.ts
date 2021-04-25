import { PasswordReset } from '@domain/usecases'
import { UserError } from '@errors/user-error'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { UpdateAccountRepository } from '@usecases/protocols/account/update-account-repository'
import { Hasher } from '@usecases/protocols/cryptography/hasher'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'

export class PasswordResetUseCase implements PasswordReset {

  constructor(
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmail: LoadAccountByEmailRepository,
    private hasher: Hasher,
    private updateAccount: UpdateAccountRepository,
  ) { }

  async reset(token: string, password: string): Promise<void> {
    const payload = this.tokenDecoder.decode(token)
    if (!payload) throw new UserError('Invalid or expired token')

    const { email } = payload
    const account = await this.loadAccountByEmail.loadByEmail(email)
    if (!account) throw new UserError('Invalid Account')

    const hashedPassword = await this.hasher.hash(password)
    await this.updateAccount.updateAccount(account.id, { password: hashedPassword })
  }

}
