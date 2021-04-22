import { UserError } from '@errors/user-error'

export class ValidationError extends UserError {

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }

}
