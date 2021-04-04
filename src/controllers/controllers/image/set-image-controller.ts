import { ValidationError } from '@controllers/errors/validation-error'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'
import { SetImage } from '@domain/usecases'

export class SetImageController implements AuthenticatedController {

  constructor(
    private validator: Validator,
    private setImage: SetImage,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const setted = await this.setImage.setImage(request.body.image.buffer, request.account)
      return ok(setted)
    } catch (error) {
      if (error instanceof ValidationError)
        return badRequest(error)
      else
        return serverError(error)
    }
  }

}
