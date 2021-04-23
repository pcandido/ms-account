import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'
import { SetImage } from '@domain/usecases'
import { UserError } from '@errors/user-error'

export class SetImageController implements AuthenticatedController {

  constructor(
    private validator: Validator,
    private setImage: SetImage,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const setted = await this.setImage.setImage(request.account, request.body.image.buffer)
      return ok(setted)
    } catch (error) {
      if (error instanceof UserError)
        return error.toResponse()
      else
        return serverError(error)
    }
  }

}
