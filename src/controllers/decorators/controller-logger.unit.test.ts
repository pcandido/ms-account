import { serverError } from '@controllers/helpers/http-helper'
import { Controller, AuthenticatedController, Response } from '@controllers/protocols'
import { Logger } from '@utils/logger'
import { AuthenticatedControllerLogger, ControllerLogger } from './controller-logger'
import { ok } from '@controllers/helpers/http-helper'

const makeRequest = () => ({
  body: {
    field: 'field',
  },
  account: {
    id: '123',
    name: 'any name',
    email: 'any@email.com',
  },
})

const makeResponse = () => ok({ ok: true })

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

describe('ControllerLogger Decorator', () => {

  interface SutTypes {
    sut: ControllerLogger
    controllerStub: Controller
    loggerStub: Logger
  }

  const makeControllerStub = () => {
    class ControllerStub implements Controller {
      async handle(): Promise<Response> {
        return makeResponse()
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

    await sut.handle(makeRequest())
    expect(handleSpy).toBeCalledWith(makeRequest())
  })

  it('should return the controller return', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeRequest())
    expect(response).toEqual(makeResponse())
  })

  it('should call the logger.error if controller returns an internal error', async () => {
    const { sut, controllerStub, loggerStub } = makeSut()
    const givenError = new Error('internal error')

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(givenError))
    const errorSpy = jest.spyOn(loggerStub, 'error')

    await sut.handle(makeRequest())
    expect(errorSpy).toBeCalledWith(givenError)
  })

  it('should not call the logger.error if controller does not return an internal error', async () => {
    const { sut, loggerStub } = makeSut()
    const errorSpy = jest.spyOn(loggerStub, 'error')
    await sut.handle(makeRequest())
    expect(errorSpy).not.toBeCalled()
  })

})

describe('AuthenticatedControllerLogger Decorator', () => {

  interface SutTypes {
    sut: AuthenticatedControllerLogger
    controllerStub: AuthenticatedController
    loggerStub: Logger
  }

  const makeControllerStub = () => {
    class ControllerStub implements AuthenticatedController {
      async handle(): Promise<Response> {
        return makeResponse()
      }
    }
    return new ControllerStub()
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const loggerStub = makeLoggerStub()
    const sut = new AuthenticatedControllerLogger(controllerStub, loggerStub)
    return { sut, controllerStub, loggerStub }
  }

  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeRequest())
    expect(handleSpy).toBeCalledWith(makeRequest())
  })

  it('should return the controller return', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeRequest())
    expect(response).toEqual(makeResponse())
  })

  it('should call the logger.error if controller returns an internal error', async () => {
    const { sut, controllerStub, loggerStub } = makeSut()
    const givenError = new Error('internal error')

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(givenError))
    const errorSpy = jest.spyOn(loggerStub, 'error')

    await sut.handle(makeRequest())
    expect(errorSpy).toBeCalledWith(givenError)
  })

  it('should not call the logger.error if controller does not return an internal error', async () => {
    const { sut, loggerStub } = makeSut()
    const errorSpy = jest.spyOn(loggerStub, 'error')
    await sut.handle(makeRequest())
    expect(errorSpy).not.toBeCalled()
  })

})
