import { serverError } from '@presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { Logger } from '@utils/logger'
import { ControllerLogger } from './controller-logger'

describe('ControllerLogger Decorator', () => {

  interface SutTypes {
    sut: ControllerLogger
    controllerStub: Controller
    loggerStub: Logger
  }

  const givenHttpRequest = {
    body: {
      field: 'field',
    },
  }

  const givenHttpResponse = {
    statusCode: 200,
    body: {
      ok: true,
    },
  }

  const makeLoggerStub = () => {
    class LoggerStub implements Logger {
      debug(message: string): void { /* do nothing */ }
      info(message: string): void { /* do nothing */ }
      warn(message: string): void { /* do nothing */ }
      error(message: string | Error): void { /* do nothing */ }
      fatal(message: string | Error): void { /* do nothing */ }
    }
    return new LoggerStub()
  }

  const makeControllerStub = () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return givenHttpResponse
      }
    }
    return new ControllerStub()
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const loggerStub = makeLoggerStub()
    const sut = new ControllerLogger(controllerStub, loggerStub)
    return { sut, controllerStub, loggerStub }
  }

  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(givenHttpRequest)
    expect(handleSpy).toBeCalledWith(givenHttpRequest)
  })

  it('should return the controller return', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(givenHttpRequest)
    expect(response).toEqual(givenHttpResponse)
  })

  it('should call the logger.error if controller returns an internal error', async () => {
    const { sut, controllerStub, loggerStub } = makeSut()
    const givenError = new Error('internal error')

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(givenError))
    const errorSpy = jest.spyOn(loggerStub, 'error')

    await sut.handle(givenHttpRequest)

    expect(errorSpy).toBeCalledWith(givenError)
  })

  it('should not call the logger.error if controller does not return an internal error', async () => {
    const { sut, loggerStub } = makeSut()
    const errorSpy = jest.spyOn(loggerStub, 'error')
    await sut.handle(givenHttpRequest)
    expect(errorSpy).not.toBeCalled()
  })

})
