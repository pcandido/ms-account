import { EmailFieldValidator } from '@presentation/helpers/validation/email-field-validator.ts'
import { MissingParamValidator } from '@presentation/helpers/validation/missing-param-validator'
import { Validator } from '@presentation/helpers/validation/validator'
import { ValidatorComposite } from '@presentation/helpers/validation/validator-composite'
import { EmailValidator } from '@presentation/protocols'

export const loginValidator = (emailValidator: EmailValidator): Validator => {

  const requiredFields = ['email', 'password']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new EmailFieldValidator('email', emailValidator),
  ])
}
