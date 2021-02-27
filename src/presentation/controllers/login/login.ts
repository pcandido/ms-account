import { Authenticator } from '@domain/usecases'
import { InvalidParamError, ValidationError } from '@presentation/errors'
import { bodyValidator } from '@presentation/helpers/body-validator'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  constructor(
    private emailValidator: EmailValidator,
    private authenticator: Authenticator,
  ) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      bodyValidator(request.body, ['email', 'password'])
      const { email, password } = request.body

      if (!this.emailValidator.isValid(email)) {
        throw new InvalidParamError('email')
      }

      const token = await this.authenticator.auth(email, password)

      return ok({})

    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
