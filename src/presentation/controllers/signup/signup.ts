import { Controller, HttpRequest, HttpResponse, EmailValidator } from '@presentation/protocols'
import { InvalidParamError, ValidationError } from '@presentation/errors'
import { badRequest, serverError, created } from '@presentation/helpers/http-helper'
import { AddAccount } from '@domain/usecases'
import { bodyValidator } from '@presentation/helpers/body-validator'

export class SignUpController implements Controller {

  constructor(
    private emailValidator: EmailValidator,
    private addAccount: AddAccount,
  ) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      bodyValidator(request.body, ['name', 'email', 'password', 'passwordConfirmation'])
      const { email, password, passwordConfirmation } = request.body

      if (!this.emailValidator.isValid(email)) {
        throw new InvalidParamError('email')
      }

      if (password !== passwordConfirmation) {
        throw new InvalidParamError('passwordConfirmation')
      }

      const account = await this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      })
      
      return created(account)
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
