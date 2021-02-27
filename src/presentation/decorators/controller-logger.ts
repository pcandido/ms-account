import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { Logger } from '@utils/logger'

export class ControllerLogger implements Controller {

  constructor(
    private controller: Controller,
    private logger: Logger,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    if (response.statusCode === 500) {
      this.logger.error(response.body.cause || response.body)
    }

    return response
  }

}
