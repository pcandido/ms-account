import { MissingParamError } from '@presentation/errors'
import { MissingParamValidator } from './missing-param-validator'

interface SutTypes {
  sut: MissingParamValidator
}

const makeSut = (): SutTypes => ({
  sut: new MissingParamValidator('field1'),
})

describe('MissingParamValidator', () => {

  it('should throw if param is not present', () => {
    const { sut } = makeSut()
    const givingBody = { field2: 2 }

    expect(() => { sut.validate(givingBody) }).toThrow(new MissingParamError('field1'))
  })

  it('should not throw if param is present', () => {
    const { sut } = makeSut()
    const givingBody = { field1: 1, field2: 2 }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

})
