import { HttpRequest, HttpResponse } from '@src/presentation/protocols/http'
import { MissingParamError } from '@src/presentation/errors/missing-param-error'
import { badRequest } from '@src/presentation/helpers/http-helper'

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    if (!request.body.name)
      return badRequest(new MissingParamError('name'))

    if (!request.body.email)
      return badRequest(new MissingParamError('email'))

    return { statusCode: 200, body: {} }
  }
}
