export class InternalError extends Error {

  constructor() {
    super(`Internal Server Error`)
    this.name = this.constructor.name
  }

}
