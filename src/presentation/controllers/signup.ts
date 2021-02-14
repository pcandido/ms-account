import { Controller, HttpRequest, HttpResponse, EmailValidator } from '@presentation/protocols'
import { MissingParamError, InvalidParamError } from '@presentation/errors'
import { badRequest, serverError } from '@presentation/helpers/http-helper'
import { Logger } from '@service/logger'

export class SignUpController implements Controller {

  constructor(private logger: Logger, private emailValidator: EmailValidator) { }

  handle(request: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!request.body[field])
          return badRequest(new MissingParamError(field))
      }

      if (!this.emailValidator.isValid(request.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      if(request.body.password !== request.body.passwordConfirmation){
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      return { statusCode: 200, body: {} }
    } catch (error) {
      this.logger.error(error)
      return serverError()
    }
  }
}
