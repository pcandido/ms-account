import { MatchFieldsValidator, MissingParamValidator, ValidatorComposite } from '@controllers/helpers/validation'

export const passwordResetValidator = () => {

  return new ValidatorComposite([
    new MissingParamValidator('token'),
    new MissingParamValidator('password'),
    new MissingParamValidator('passwordConfirmation'),
    new MatchFieldsValidator('password', 'passwordConfirmation'),
  ])

}
