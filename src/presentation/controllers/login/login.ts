import { Authenticator } from '@domain/usecases'
import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  constructor(
    private emailValidator: EmailValidator,
    private authenticator: Authenticator,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email)
        return badRequest(new MissingParamError('email'))
      if (!password)
        return badRequest(new MissingParamError('password'))
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authenticator.auth(email, password)

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }

}
