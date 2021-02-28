import { Request } from '@presentation/protocols/http'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { Controller } from '@presentation/protocols/controllers'

export const adaptRoute = (controller: Controller) => {

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const request: Request = {
      body: req.body,
    }

    const response = await controller.handle(request)

    res.status(response.statusCode).json(response.body)
  }

}
