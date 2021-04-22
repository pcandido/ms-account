import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { badRequest, serverError, created } from '@controllers/helpers/http-helper'
import { AddAccount } from '@domain/usecases'
import { UserError } from '@errors/user-error'

export class SignUpController implements Controller {

  constructor(
    private addAccount: AddAccount,
    private validator: Validator,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)

      const account = await this.addAccount.add({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      })

      const { password, ...response } = account

      return created(response)
    } catch (error) {
      if (error instanceof UserError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }
}
