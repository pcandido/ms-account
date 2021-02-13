import { HttpRequest, HttpResponse } from '@src/presentation/protocols/http'
import { MissingParamError } from '@src/presentation/errors/missing-param-error'
import { badRequest } from '@src/presentation/helpers/http-helper'

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!request.body[field])
        return badRequest(new MissingParamError(field))
    }

    return { statusCode: 200, body: {} }
  }
}
