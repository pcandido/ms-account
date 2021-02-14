import { HttpResponse } from '@src/presentation/protocols/http'
import { ServerError } from '@src/presentation/errors/server-error'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})
