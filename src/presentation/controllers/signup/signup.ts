import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { ValidationError } from '@presentation/errors'
import { badRequest, serverError, created } from '@presentation/helpers/http-helper'
import { AddAccount } from '@domain/usecases'
import { Validator } from '@presentation/helpers/validation/validator'

export class SignUpController implements Controller {

  constructor(
    private addAccount: AddAccount,
    private validator: Validator,
  ) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(request.body)

      const account = await this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      })

      return created(account)
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }
}
