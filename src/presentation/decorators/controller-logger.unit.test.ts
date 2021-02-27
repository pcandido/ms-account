import { serverError } from '@presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@presentation/protocols'
import { Logger } from '@utils/logger'
import { ControllerLogger } from './controller-logger'
import { ok } from '@presentation/helpers/http-helper'

interface SutTypes {
  sut: ControllerLogger
  controllerStub: Controller
  loggerStub: Logger
}

const makeHttpRequest = () => ({
  body: {
    field: 'field',
  },
})

const makeHttpResponse = () => ok({ ok: true })

const makeLoggerStub = () => {
  class LoggerStub implements Logger {
    debug(): void { /* do nothing */ }
    info(): void { /* do nothing */ }
    warn(): void { /* do nothing */ }
    error(): void { /* do nothing */ }
    fatal(): void { /* do nothing */ }
  }
  return new LoggerStub()
}

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return makeHttpResponse()
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

describe('ControllerLogger Decorator', () => {

  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeHttpRequest())
    expect(handleSpy).toBeCalledWith(makeHttpRequest())
  })

  it('should return the controller return', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(makeHttpResponse())
  })

  it('should call the logger.error if controller returns an internal error', async () => {
    const { sut, controllerStub, loggerStub } = makeSut()
    const givenError = new Error('internal error')

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(givenError))
    const errorSpy = jest.spyOn(loggerStub, 'error')

    await sut.handle(makeHttpRequest())
    expect(errorSpy).toBeCalledWith(givenError)
  })

  it('should not call the logger.error if controller does not return an internal error', async () => {
    const { sut, loggerStub } = makeSut()
    const errorSpy = jest.spyOn(loggerStub, 'error')
    await sut.handle(makeHttpRequest())
    expect(errorSpy).not.toBeCalled()
  })

})
