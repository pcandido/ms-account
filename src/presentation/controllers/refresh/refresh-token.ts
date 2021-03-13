import { Controller, Request, Response, Validator } from '@presentation/protocols'
import { ok } from '@presentation/helpers/http-helper'

export class RefreshTokenController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    this.validator.validate(request.body)

    return ok({})
  }

}
