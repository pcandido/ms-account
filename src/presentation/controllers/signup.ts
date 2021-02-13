import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { MissingParamError } from '@presentation/errors/missing-param-error'
import { badRequest } from '@presentation/helpers/http-helper'

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!request.body[field])
        return badRequest(new MissingParamError(field))
    }

    return { statusCode: 200, body: {} }
  }
}
