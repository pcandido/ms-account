import { MissingParamValidator } from '@controllers/helpers/validation'
import { Validator } from '@controllers/protocols'

export const passwordRecoveryValidator = ():Validator => {

  return new MissingParamValidator('email')

}
