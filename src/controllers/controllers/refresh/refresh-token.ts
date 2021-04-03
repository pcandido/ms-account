import { Controller, Request, Response, Validator } from '@controllers/protocols'
import { badRequest, ok, serverError, unauthorized } from '@controllers/helpers/http-helper'
import { ValidationError } from '@controllers/errors/validation-error'
import { RefreshToken } from '@domain/usecases'
import { AuthenticationError } from '@controllers/errors/authentication-error'

export class RefreshTokenController implements Controller {

  constructor(
    private validator: Validator,
    private refreshToken: RefreshToken,
  ) { }

  async handle(request: Request): Promise<Response> {
    try {
      if (!request.account) throw new Error('Unauthorized')

      this.validator.validate(request.body)
      const tokens = await this.refreshToken.refresh(request.account, request.body.refreshToken)
      if (!tokens) return unauthorized(new AuthenticationError('Refresh Token is expired or invalid'))
      return ok(tokens)
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error)
      } else {
        return serverError(error)
      }
    }
  }

}
