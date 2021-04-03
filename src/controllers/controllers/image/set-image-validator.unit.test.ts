import { MissingParamError, InvalidParamError } from '@controllers/errors'
import { Validator, MultPartFile } from '@controllers/protocols'
import { setImageValidator } from './set-image-validator'

interface SutTypes {
  sut: Validator
}

const makeSut = (): SutTypes => {
  const sut = setImageValidator()
  return { sut }
}

const makeImage = (): MultPartFile => ({
  originalName: 'any_name',
  size: 500,
  encoding: 'utf-8',
  mimeType: 'image/jpg',
  buffer: Buffer.from('any_image', 'utf-8'),
})

describe('SetImageValidator', () => {

  it('should throw if no image is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('image'))
  })

  it('should throw if mime type is not image', async () => {
    const { sut } = makeSut()
    const givenRequest = { image: makeImage() }
    givenRequest.image.mimeType = 'application/json'
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('image'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenRequest = { image: makeImage() }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
