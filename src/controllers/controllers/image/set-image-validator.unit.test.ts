import { MissingParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'
import { setImageValidator } from './set-image-validator'

interface SutTypes {
  sut: Validator
}

const makeSut = (): SutTypes => {
  const sut = setImageValidator()
  return { sut }
}

const makeImage = (): Buffer => {
  return Buffer.from('any_image', 'utf-8')
}

describe('SetImageValidator', () => {

  it('should throw if no image is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('image'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenRequest = { image: makeImage() }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
