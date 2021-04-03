import { MissingParamValidator } from '@controllers/helpers/validation'
import { Validator } from '@controllers/protocols'

export const setImageValidator = (): Validator => new MissingParamValidator('image')
