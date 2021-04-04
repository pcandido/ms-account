import { AuthenticatedRequest, Request, Response } from '@controllers/protocols/http'

export interface Controller {
  handle(request: Request): Promise<Response>
}

export interface AuthenticatedController {
  handle(request: AuthenticatedRequest): Promise<Response>
}
