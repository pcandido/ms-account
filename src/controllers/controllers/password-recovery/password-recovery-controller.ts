import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { badRequest, serverError } from '@controllers/helpers/http-helper'
import { ValidationError } from '@controllers/errors'

export class PasswordRecoveryController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      return { statusCode: 200, body: {} }
    } catch (error) {
      if(error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
