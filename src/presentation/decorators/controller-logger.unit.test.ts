import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { ControllerLogger } from './controller-logger'

describe('ControllerLogger Decorator', () => {

  it('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return { statusCode: 200, body: { ok: true } }
      }
    }

    const givenHttpRequest = {
      body: {
        field: 'field',
      },
    }

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const sut = new ControllerLogger(controllerStub)

    await sut.handle(givenHttpRequest)
    expect(handleSpy).toBeCalledWith(givenHttpRequest)
  })

})
