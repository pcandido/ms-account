import { JimpAdapter } from './jimp-adapter'
import Jimp from 'jimp'

jest.mock('jimp', () => {

  const getBufferAsyncFn = jest.fn().mockResolvedValue(Buffer.from('resized'))
  const scaleToFitFn = jest.fn().mockResolvedValue({ getBufferAsync: getBufferAsyncFn })
  const getMimeFn = jest.fn().mockReturnValue('any mime')
  const readFn = jest.fn().mockResolvedValue({ scaleToFit: scaleToFitFn, getMIME: getMimeFn })

  return {
    read: readFn,
    scaleToFit: scaleToFitFn,
    getBufferAsync: getBufferAsyncFn,
    getMIME: getMimeFn,
  }

})

const makeImage = () => Buffer.from('original')

const makeSut = () => new JimpAdapter()

describe('JimpAdapter', () => {

  const [givenWidth, givenHeight] = [1, 2]

  it('should call Jimp.read with correct params', async () => {
    const sut = makeSut()
    const readSpy = jest.spyOn(Jimp, 'read')
    await sut.resize(makeImage(), givenWidth, givenHeight)
    expect(readSpy).toBeCalledWith(makeImage())
  })

  it('should call scaleToFit with correct params', async () => {
    const sut = makeSut()
    const scaleToFitSpy = jest.spyOn(Jimp as any, 'scaleToFit')
    await sut.resize(makeImage(), givenWidth, givenHeight)
    expect(scaleToFitSpy).toBeCalledWith(givenWidth, givenHeight)
  })

  it('should call getBuffer with correct params', async () => {
    const sut = makeSut()
    const getBufferAsyncSpy = jest.spyOn(Jimp as any, 'getBufferAsync')
    await sut.resize(makeImage(), givenWidth, givenHeight)
    expect(getBufferAsyncSpy).toBeCalledWith('any mime')
  })

  it('should return the resized image', async () => {
    const sut = makeSut()
    const result = await sut.resize(makeImage(), 50, 60)
    expect(result).toEqual(Buffer.from('resized'))
  })

  it('should not handle Jimp internal errors', async () => {
    const sut = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(Jimp, 'read').mockRejectedValueOnce(givenError)
    await expect(() => sut.resize(makeImage(), 50, 60)).rejects.toThrow(givenError)
  })

})
