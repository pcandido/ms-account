import { Controller, Request, Response } from '@controllers/protocols'
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
