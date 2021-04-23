import { Response } from '@controllers/protocols'

export class UserError extends Error {

  constructor(message: string, private statusCode = 400) {
    super(message)
    this.name = this.constructor.name
  }

  toResponse(): Response {
    return {
      statusCode: this.statusCode,
      body: this,
    }
  }

}
