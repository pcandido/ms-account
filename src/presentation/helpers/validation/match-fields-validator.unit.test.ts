import { InvalidParamError } from '@presentation/errors'
import { MatchFieldsValidator } from './match-fields-validator'

interface SutTypes {
  sut: MatchFieldsValidator
}

const makeSut = (): SutTypes => ({
  sut: new MatchFieldsValidator('field', 'fieldToMatch'),
})

describe('MatchFieldsValidator', () => {

  it('should throw if the fields do not match', () => {
    const { sut } = makeSut()
    const givingBody = { field: 'a', fieldToMatch: 'b' }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('fieldToMatch'))
  })

  it('should not throw if param is present', () => {
    const { sut } = makeSut()
    const givingBody = { field: 'a', fieldToMatch: 'a' }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should not throw if field is not present', () => {
    const { sut } = makeSut()
    const givingBody = { fieldToMatch: 'a' }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should not throw if fieldToMatch is not present', () => {
    const { sut } = makeSut()
    const givingBody = { field: 'a' }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

})
