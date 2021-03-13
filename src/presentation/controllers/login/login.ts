import { Authentication } from '@domain/usecases'
import { ValidationError } from '@presentation/errors/validation-error'
import { badRequest, ok, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { Controller, Request, Response, Validator } from '@presentation/protocols'

export class LoginController implements Controller {

  constructor(
    private authentication: Authentication,
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)

      const { email, password } = request.body
      const tokens = await this.authentication.auth({ email, password })

      if (!tokens) {
        return unauthorized()
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
