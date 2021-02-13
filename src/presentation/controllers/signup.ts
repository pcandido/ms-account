import { Controller } from '@presentation/protocols/controllers'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { MissingParamError } from '@presentation/errors/missing-param-error'
import { badRequest } from '@presentation/helpers/http-helper'
import { EmailValidator } from '@presentation/protocols/email-validator'
import { InvalidParamError } from '@presentation/errors/invalid-param-error'

export class SignUpController implements Controller {

  constructor(private emailValidator: EmailValidator) { }

  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!request.body[field])
        return badRequest(new MissingParamError(field))
    }

    if (!this.emailValidator.isValid(request.body.email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return { statusCode: 200, body: {} }
  }
}
