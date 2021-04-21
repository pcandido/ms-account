import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { ValidationError } from '@controllers/errors'
import { PasswordRecovery } from '@domain/usecases'

export class PasswordRecoveryController implements Controller {

  constructor(
    private validator: Validator,
    private passwordRecovery: PasswordRecovery,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      await this.passwordRecovery.recovery(request.body.email)
      return ok({})
    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
