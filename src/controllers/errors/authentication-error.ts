export class AuthenticationError extends Error {

  constructor(message = 'Provided credentials are invalid') {
    super(message)
    this.name = this.constructor.name
  }

}
