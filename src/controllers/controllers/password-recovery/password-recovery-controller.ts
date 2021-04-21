import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { badRequest } from '@controllers/helpers/http-helper'

export class PasswordRecoveryController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
    } catch (error) {
      return badRequest(error)
    }
    return { statusCode: 200, body: {} }
  }

}
