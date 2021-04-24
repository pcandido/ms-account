import { serverError } from '@controllers/helpers/http-helper'
import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { PasswordReset } from '@domain/usecases'
import { UserError } from '@errors/user-error'

export class PasswordResetController implements Controller {

  constructor(
    private validator: Validator,
    private passwordReset: PasswordReset,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const { token, password } = request.body
      await this.passwordReset.reset(token, password)

      return { statusCode: 200, body: {} }
    } catch (error) {
      if (error instanceof UserError) return error.toResponse()
      return serverError(error)
    }
  }

}
