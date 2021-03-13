import { Controller, Request, Response, Validator } from '@presentation/protocols'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { ValidationError } from '@presentation/errors/validation-error'

export class RefreshTokenController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      return ok({})
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }

}
