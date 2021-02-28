import { Authenticator } from '@domain/usecases'
import { AuthenticationError, ValidationError } from '@presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { Validator } from '@presentation/helpers/validation/validator'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  constructor(
    private authenticator: Authenticator,
    private validator: Validator,
  ) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(request.body)

      const { email, password } = request.body
      const token = await this.authenticator.auth(email, password)

      return ok({ accessToken: token })
    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else if (error instanceof AuthenticationError)
        return unauthorized(error)
      else
        return serverError(error)
    }
  }

}
