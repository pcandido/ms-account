import { ValidationError } from '@controllers/errors/validation-error'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'

export class SetImageController implements AuthenticatedController {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
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
