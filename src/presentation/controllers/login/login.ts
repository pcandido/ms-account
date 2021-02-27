import { MissingParamError } from '@presentation/errors'
import { badRequest } from '@presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoginController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'))
  }

}
