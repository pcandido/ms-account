import { Controller, HttpRequest, HttpResponse, EmailValidator } from '@presentation/protocols'
import { MissingParamError, InvalidParamError, ValidationError } from '@presentation/errors'
import { badRequest, serverError } from '@presentation/helpers/http-helper'
import { Logger } from '@service/logger'

export class SignUpController implements Controller {

  constructor(private logger: Logger, private emailValidator: EmailValidator) { }

  handle(request: HttpRequest): HttpResponse {
    try {
      this.validate(request.body)

      return { statusCode: 200, body: {} }
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        this.logger.error(error)
        return serverError()
      }
    }
  }

  private validate(body: any) {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!body[field])
        throw new MissingParamError(field)
    }

    const { email, password, passwordConfirmation } = body

    if (!this.emailValidator.isValid(email)) {
      throw new InvalidParamError('email')
    }

    if (password !== passwordConfirmation) {
      throw new InvalidParamError('passwordConfirmation')
    }
  }
}
