import { MissingParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

export class MissingParamValidator implements Validator {

  constructor(
    private fieldName: string,
  ) { }

  validate(input: any): void {
    if (!input[this.fieldName])
      throw new MissingParamError(this.fieldName)
  }

}
