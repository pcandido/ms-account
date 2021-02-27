import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { ControllerLogger } from './controller-logger'

describe('ControllerLogger Decorator', () => {

  interface SutTypes {
    sut: ControllerLogger
    controllerStub: Controller
  }

  const makeControllerStub = () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return { statusCode: 200, body: { ok: true } }
      }
    }
    return new ControllerStub()
  }

  const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new ControllerLogger(controllerStub)
    return { sut, controllerStub }
  }

  it('should call controller handle', async () => {
    const givenHttpRequest = {
      body: {
        field: 'field',
      },
    }

    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(givenHttpRequest)
    expect(handleSpy).toBeCalledWith(givenHttpRequest)
  })

})
