import { InvalidParamError } from '@controllers/errors'
import { EmailValidator, Validator } from '@controllers/protocols'

export class EmailFieldValidator implements Validator {

  constructor(
    private field: string,
    private emailValidator: EmailValidator,
  ) { }

  validate(input: any): void {
    const email = input[this.field]
    if (email && !this.emailValidator.isValid(email))
      throw new InvalidParamError(this.field)
  }

}
