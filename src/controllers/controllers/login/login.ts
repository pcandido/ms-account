import { Authentication } from '@domain/usecases'
import { AuthenticationError } from '@controllers/errors/authentication-error'
import { ValidationError } from '@controllers/errors/validation-error'
import { badRequest, ok, serverError, unauthorized } from '@controllers/helpers/http-helper'
import { Controller, Request, Response, Validator } from '@controllers/protocols'

export class LoginController implements Controller {

  constructor(
    private authentication: Authentication,
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)

      const { email, password, remember } = request.body
      const tokens = await this.authentication.auth({ email, password, remember })

      if (!tokens) {
        return unauthorized(new AuthenticationError())
      }

      return ok(tokens)
    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
