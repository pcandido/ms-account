import { Controller, Request, Response, Validator } from '@presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { ValidationError } from '@presentation/errors/validation-error'
import { RefreshToken } from '@domain/usecases'
import { AuthenticationError } from '@presentation/errors/authentication-error'

export class RefreshTokenController implements Controller {

  constructor(
    private validator: Validator,
    private refreshToken: RefreshToken,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const tokens = await this.refreshToken.refresh(request.body.refreshToken)
      if (!tokens) return unauthorized(new AuthenticationError('Refresh Token is expired or invalid'))
      return ok({})
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }

}
