import { MissingParamError } from '@presentation/errors'
import { badRequest } from '@presentation/helpers/http-helper'
import { Controller, Request, Response } from '@presentation/protocols'

export class RefreshTokenController implements Controller {

  async handle(request: Request): Promise<Response> {
    return badRequest(new MissingParamError('refreshToken'))
  }

}
