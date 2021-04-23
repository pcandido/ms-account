import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'
import { badRequest, ok, serverError, unauthorized } from '@controllers/helpers/http-helper'
import { RefreshToken } from '@domain/usecases'
import { AuthenticationError } from '@controllers/errors/authentication-error'
import { UserError } from '@errors/user-error'

export class RefreshTokenController implements AuthenticatedController {

  constructor(
    private validator: Validator,
    private refreshToken: RefreshToken,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const tokens = await this.refreshToken.refresh(request.account, request.body.refreshToken)
      if (!tokens) return unauthorized(new AuthenticationError('Refresh Token is expired or invalid'))
      return ok(tokens)
    } catch (error) {
      if (error instanceof UserError)
        return error.toResponse()
      else
        return serverError(error)
    }
  }

}
