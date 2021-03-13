import { MissingParamValidator } from '@presentation/helpers/validation'
import { Validator } from '@presentation/protocols'

export const refreshTokenValidator = (): Validator => {
  return new MissingParamValidator('refreshToken')
}
