import { MissingParamValidator, EmailFieldValidator, ValidatorComposite } from '@controllers/helpers/validation'
import { EmailValidator, Validator } from '@controllers/protocols'

export const loginValidator = (emailValidator: EmailValidator): Validator => {

  const requiredFields = ['email', 'password']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new EmailFieldValidator('email', emailValidator),
  ])
}
