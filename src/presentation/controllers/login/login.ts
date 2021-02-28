import { Authentication } from '@domain/usecases'
import { AuthenticationError } from '@errors/authentication-error'
import { ValidationError } from '@errors/validation-error'
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
      const token = await this.authentication.auth({ email, password })

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
