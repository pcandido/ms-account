import { HttpResponse } from '@presentation/protocols'
import { ServerError } from '@presentation/errors'

export const created = <T>(body: T): HttpResponse => ({
  statusCode: 201,
  body,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error?.message ?? error,
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})
