import { Request } from '@controllers/protocols/http'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { Controller } from '@controllers/protocols/controllers'

export const adaptRoute = (controller: Controller) => {

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const request: Request = { body: req.body }

    const { statusCode, body } = await controller.handle(request)
    const resBody = body instanceof Error ? body.message : body

    res
      .status(statusCode)
      .json(resBody)
  }

}
