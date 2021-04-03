import { ValidationError } from '@controllers/errors/validation-error'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { Controller, Request, Response, Validator } from '@controllers/protocols'

export class SetImageController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      return ok({})
    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
