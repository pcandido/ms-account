import { PasswordRecovery } from '@domain/usecases'
import { UserError } from '@errors/user-error'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { EmailSender } from '@usecases/protocols/email/email-sender'
import fs from 'fs'
import { promisify } from 'util'

export class PasswordRecoveryUseCase implements PasswordRecovery {

  constructor(
    private loadAccountByEmailRepositry: LoadAccountByEmailRepository,
    private tokenGenerator: TokenGenerator,
    private emailSender: EmailSender,
    private tokenExpiresInMinutes: number,
    private emailSubjectFile: string,
    private emailTemplateFile: string,
    private recoverEndpoint: string,
  ) { }

  async recover(email: string): Promise<void> {
    const account = await this.loadAccountByEmailRepositry.loadByEmail(email)
    if (!account)
      throw new UserError('There is no account with the provied Email')

    const token = this.tokenGenerator.generate({ email }, this.tokenExpiresInMinutes)

    const link = `${this.recoverEndpoint}?token=${token}`
    const subject = (await promisify(fs.readFile)(this.emailSubjectFile)).toString()
    const template = (await promisify(fs.readFile)(this.emailTemplateFile)).toString()

    const body = template
      .replace('{{name}}', account.name)
      .replace('{{link}}', link)

    await this.emailSender.send({
      to: email,
      subject,
      body,
    })
  }

}
