import { HttpRequest, HttpResponse } from '@src/presentation/protocols/http'
import { MissingParamError } from '@src/presentation/errors/missing-param-error'

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      }
    }
    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      }
    }

    return { statusCode: 200, body: {} }
  }
}
