import { ConsoleLoggerAdapter } from './console-logger-adapter'

describe('ConsoleLoggerAdapter', () => {

  const givenMessage = 'any message'

  const makeConsoleSpy = (method: 'info' | 'warn' | 'error') => jest.spyOn(console, method).mockImplementation(() => {/* do nothing */ })
  const makeSut = () => new ConsoleLoggerAdapter()

  it('should call info when logger.debug is called', () => {
    const infoSpy = makeConsoleSpy('info')
    const sut = makeSut()
    sut.debug(givenMessage)
    expect(infoSpy).toHaveBeenCalledWith(givenMessage)
  })

  it('should call info when logger.info is called', () => {
    const infoSpy = makeConsoleSpy('info')
    const sut = makeSut()
    sut.info(givenMessage)
    expect(infoSpy).toHaveBeenCalledWith(givenMessage)
  })

  it('should call warn when logger.warn is called', () => {
    const warnSpy = makeConsoleSpy('warn')
    const sut = makeSut()
    sut.warn(givenMessage)
    expect(warnSpy).toHaveBeenCalledWith(givenMessage)
  })

  it('should call error when logger.error is called', () => {
    const errorSpy = makeConsoleSpy('error')
    const sut = makeSut()
    sut.error(givenMessage)
    expect(errorSpy).toHaveBeenCalledWith(givenMessage)
  })

  it('should call error when logger.fatal is called', () => {
    const errorSpy = makeConsoleSpy('error')
    const sut = makeSut()
    sut.fatal(givenMessage)
    expect(errorSpy).toHaveBeenCalledWith(givenMessage)
  })

})
