import { MissingParamError } from '@presentation/errors'
import { badRequest, ok } from '@presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email)
      return badRequest(new MissingParamError('email'))
    if (!httpRequest.body.password)
      return badRequest(new MissingParamError('password'))

    return ok({})
  }

}
