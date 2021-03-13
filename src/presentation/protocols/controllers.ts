import { Request, Response } from '@presentation/protocols/http'

export interface Controller {

  handle(request: Request): Promise<Response>

}
