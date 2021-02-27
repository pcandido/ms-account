import { HttpResponse } from '@presentation/protocols'
import { AuthenticationError, ServerError } from '@presentation/errors'

export const ok = <T>(body: T): HttpResponse => ({
  statusCode: 200,
  body,
})

export const created = <T>(body: T): HttpResponse => ({
  statusCode: 201,
  body,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const unauthorized = (error: AuthenticationError): HttpResponse => ({
  statusCode: 401,
  body: error,
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error),
})
