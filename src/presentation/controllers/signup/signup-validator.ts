import { MatchFieldsValidator } from '@presentation/helpers/validation/match-fields-validator'
import { MissingParamValidator } from '@presentation/helpers/validation/missing-param-validator'
import { Validator } from '@presentation/helpers/validation/validator'
import { ValidatorComposite } from '@presentation/helpers/validation/validator-composite'

export const signupValidator = (): Validator => {

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  return new ValidatorComposite([
    ...requiredFields.map(a => new MissingParamValidator(a)),
    new MatchFieldsValidator('password', 'passwordConfirmation'),
  ])
}
