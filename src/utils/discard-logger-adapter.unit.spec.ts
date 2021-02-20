import { DiscardLoggerAdapter } from './discard-logger-adapter'

describe('DiscardLoggerAdapter', () => {

  const makeSut = () => new DiscardLoggerAdapter()

  it('should do nothing on debug', () => {
    const sut = makeSut()
    sut.debug('any message')
  })

  it('should do nothing on info', () => {
    const sut = makeSut()
    sut.info('any message')
  })

  it('should do nothing on warn', () => {
    const sut = makeSut()
    sut.warn('any message')
  })

  it('should do nothing on error', () => {
    const sut = makeSut()
    sut.error('any message')
  })

  it('should do nothing on fatal', () => {
    const sut = makeSut()
    sut.fatal('any message')
  })

})
