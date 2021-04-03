import { InvalidParamError } from '@controllers/errors'
import { ImageFieldValidator } from './image-field-validator'

interface SutTypes {
  sut: ImageFieldValidator
}

const makeSut = (): SutTypes => ({
  sut: new ImageFieldValidator('field1', 10),
})

describe('ImageFieldValidator', () => {

  it('should not throw if param is not present', () => {
    const { sut } = makeSut()
    const givingBody = { field2: 2 }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should throw if field is not an MultPartFile', () => {
    const { sut } = makeSut()
    const givingBody = { field1: 1 }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should throw if file is not an image', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: {
        mimeType: 'application/json',
        size: 500,
        buffer: Buffer.from('any_value', 'utf-8'),
      },
    }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should throw if file size is greater than the limit', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: {
        mimeType: 'image/jpg',
        size: 50 * 1024 * 1024,
        buffer: Buffer.from('any_value', 'utf-8'),
      },
    }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should not throw if image is valid', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: {
        mimeType: 'image/jpg',
        size: 8 * 1024 * 1024,
        buffer: Buffer.from('any_value', 'utf-8'),
      },
    }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

})
