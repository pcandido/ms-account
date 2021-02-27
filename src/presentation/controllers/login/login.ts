import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { badRequest, ok } from '@presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  constructor(
    private emailValidator: EmailValidator,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email)
      return badRequest(new MissingParamError('email'))
    if (!password)
      return badRequest(new MissingParamError('password'))
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return ok({})
  }

}
