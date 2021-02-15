import { Controller, HttpRequest, HttpResponse, EmailValidator } from '@presentation/protocols'
import { MissingParamError, InvalidParamError, ValidationError } from '@presentation/errors'
import { badRequest, serverError } from '@presentation/helpers/http-helper'
import { Logger } from '@service/logger'
import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'

export class SignUpController implements Controller {

  constructor(
    private logger: Logger,
    private emailValidator: EmailValidator,
    private addAccount: AddAccount,
  ) { }

  handle(request: HttpRequest): HttpResponse {
    try {
      this.validate(request.body)
      const account = this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      })
      return { statusCode: 201, body: account }
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        this.logger.error(error)
        return serverError()
      }
    }
  }

  private validate(body: any) {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!body[field])
        throw new MissingParamError(field)
    }

    const { email, password, passwordConfirmation } = body

    if (!this.emailValidator.isValid(email)) {
      throw new InvalidParamError('email')
    }

    if (password !== passwordConfirmation) {
      throw new InvalidParamError('passwordConfirmation')
    }
  }
}
