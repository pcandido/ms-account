import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

interface SutTypes {
  validator1: Validator
  validator2: Validator
  sut: ValidatorComposite
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validator1 = makeValidator()
  const validator2 = makeValidator()
  const sut = new ValidatorComposite([validator1, validator2])
  return { sut, validator1, validator2 }
}

describe('ValidatorComposite', () => {

  it('should throw if validator1 throws', () => {
    const { sut, validator1 } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(validator1, 'validate').mockImplementation(() => { throw givenError })

    expect(() => sut.validate({})).toThrow(givenError)
  })

  it('should throw if validator2 throws', () => {
    const { sut, validator2 } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(validator2, 'validate').mockImplementation(() => { throw givenError })

    expect(() => sut.validate({})).toThrow(givenError)
  })

  it('should not throw if no validator throw', () => {
    const { sut } = makeSut()
    expect(() => sut.validate({})).not.toThrow()
  })

})
