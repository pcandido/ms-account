import { MissingParamError } from '@presentation/errors'
import { Validator } from '@presentation/protocols'

export class MissingParamValidator implements Validator {

  constructor(
    private fieldName: string,
  ) { }

  validate(input: any): void {
    if (!input[this.fieldName])
      throw new MissingParamError(this.fieldName)
  }

}
