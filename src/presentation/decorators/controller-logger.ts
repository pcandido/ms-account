import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

export class ControllerLogger implements Controller {

  constructor(private controller: Controller) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.controller.handle(httpRequest)
    return null
  }

}
