import { HttpRequest } from '@presentation/protocols/http'
import { Request, Response } from 'express'
import { Controller } from '@presentation/protocols/controllers'

export const ExpressRequestAdapter = (controller: Controller) => {

  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }

    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }

}
