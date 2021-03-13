import { MissingParamValidator, MatchFieldsValidator, EmailFieldValidator, ValidatorComposite } from '@presentation/helpers/validation'
import { EmailValidator, Validator } from '@presentation/protocols'

export const signupValidator = (emailValidator: EmailValidator): Validator => {

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new MatchFieldsValidator('password', 'passwordConfirmation'),
    new EmailFieldValidator('email', emailValidator),
  ])
}
