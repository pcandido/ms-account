import { Request, Response } from '@controllers/protocols/http'

export interface Controller {

  handle(request: Request): Promise<Response>

}
