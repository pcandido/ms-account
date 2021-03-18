import { InvalidParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

export class MatchFieldsValidator implements Validator {

  constructor(
    private field: string,
    private fieldToMatch: string,
  ) { }

  validate(input: any): void {
    if (!input[this.field]) return
    if (!input[this.fieldToMatch]) return

    if (input[this.field] !== input[this.fieldToMatch])
      throw new InvalidParamError(this.fieldToMatch)
  }

}
