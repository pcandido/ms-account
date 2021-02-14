import { ValidationError } from './validation-error'

export class MissingParamError extends ValidationError {

  constructor(paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = this.constructor.name
  }

}
