import { serverError } from '@controllers/helpers/http-helper'
import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { UserError } from '@errors/user-error'

export class PasswordResetController implements Controller {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try{

      this.validator.validate(request.body)

      return { statusCode: 200, body: {} }
    }catch(error){
      if(error instanceof UserError) return error.toResponse()
      return serverError(error)
    }
  }

}
