import { MissingParamValidator } from '@controllers/helpers/validation'
import { Validator } from '@controllers/protocols'

export const refreshTokenValidator = (): Validator => {
  return new MissingParamValidator('refreshToken')
}
