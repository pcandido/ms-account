import { MissingParamValidator, MatchFieldsValidator, EmailFieldValidator, ValidatorComposite } from '@controllers/helpers/validation'
import { EmailValidator, Validator } from '@controllers/protocols'

export const signupValidator = (emailValidator: EmailValidator): Validator => {

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new MatchFieldsValidator('password', 'passwordConfirmation'),
    new EmailFieldValidator('email', emailValidator),
  ])
}
