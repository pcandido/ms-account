import { AuthenticatedController, AuthenticatedRequest, Controller, Request, Response } from '@controllers/protocols'
import { Logger } from '@utils/logger'

export class ControllerLogger implements Controller {

  constructor(
    private controller: Controller,
    private logger: Logger,
  ) { }

  async handle(request: Request): Promise<Response> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      this.logger.error(response.body.cause || response.body)
    }

    return response
  }

}

export class AuthenticatedControllerLogger implements AuthenticatedController {

  constructor(
    private controller: AuthenticatedController,
    private logger: Logger,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      this.logger.error(response.body.cause || response.body)
    }

    return response
  }

}
