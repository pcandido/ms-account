export class AuthenticationError extends Error {

  constructor() {
    super('Provided credentials are invalid')
    this.name = this.constructor.name
  }

}
