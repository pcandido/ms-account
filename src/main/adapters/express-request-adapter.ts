import { AuthenticatedRequest, Request } from '@controllers/protocols/http'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { AuthenticatedController, Controller } from '@controllers/protocols/controllers'

export const adaptRoute = (controller: Controller) => {

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const request: Request = { body: req.body, account: req.account }

    const { statusCode, body } = await controller.handle(request)
    const resBody = body instanceof Error ? body.message : body

    res
      .status(statusCode)
      .json(resBody)
  }

}

export const adaptAuthenticatedRoute = (controller: AuthenticatedController) => {

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    if (!req.account) {
      res.status(401).send('Unauthorized')
      return
    }

    const request: AuthenticatedRequest = { body: req.body, account: req.account }

    const { statusCode, body } = await controller.handle(request)
    const resBody = body instanceof Error ? body.message : body

    res
      .status(statusCode)
      .json(resBody)
  }

}
