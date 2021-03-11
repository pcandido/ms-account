export class ServerError extends Error {

  constructor(private _cause: Error) {
    super(`Internal Server Error`)
    this.name = this.constructor.name
  }

  get cause(): Error {
    return this._cause
  }

}
