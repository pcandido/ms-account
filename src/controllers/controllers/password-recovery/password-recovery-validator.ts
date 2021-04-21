import { EmailFieldValidator, MissingParamValidator, ValidatorComposite } from '@controllers/helpers/validation'
import { Validator, EmailValidator } from '@controllers/protocols'

export const passwordRecoveryValidator = (emailValidator: EmailValidator): Validator => {

  return new ValidatorComposite([
    new MissingParamValidator('email'),
    new EmailFieldValidator('email', emailValidator),
  ])

}
