import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { ControllerLogger } from './controller-logger'

describe('ControllerLogger Decorator', () => {

  interface SutTypes {
    sut: ControllerLogger
    controllerStub: Controller
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
    const sut = new ControllerLogger(controllerStub)
    return { sut, controllerStub }
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

})
