import { EmailFieldValidator } from '@presentation/helpers/validation/email-field-validator.ts'
import { MatchFieldsValidator } from '@presentation/helpers/validation/match-fields-validator'
import { MissingParamValidator } from '@presentation/helpers/validation/missing-param-validator'
import { Validator } from '@presentation/helpers/validation/validator'
import { ValidatorComposite } from '@presentation/helpers/validation/validator-composite'
import { EmailValidator } from '@presentation/protocols'

export const signupValidator = (emailValidator: EmailValidator): Validator => {

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new MatchFieldsValidator('password', 'passwordConfirmation'),
    new EmailFieldValidator('email', emailValidator),
  ])
}
