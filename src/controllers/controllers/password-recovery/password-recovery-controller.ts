import { Controller, Request, Response, Validator } from '@controllers/protocols'

export class PasswordRecoveryController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    this.validator.validate(request.body)

    return { statusCode: 200, body: {} }
  }

}
