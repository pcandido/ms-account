import { Validator } from '@controllers/protocols'

export class ValidatorComposite implements Validator {

  constructor(
    private validators: Validator[],
  ) { }

  validate(input: any): void {
    this.validators.forEach(a => a.validate(input))
  }

}
