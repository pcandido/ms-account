import { passwordRecoveryValidator } from './password-recovery-validator'
import { MissingParamError } from '@controllers/errors'
import { Validator } from '@controllrs/protocols'

interface SutTypes {
  sut: Validator
}

const makeSut = (): SutTypes => {

  const sut = passwordRecoveryValidator()
  return { sut }
}

describe('passwordRecoveryValidator', () => {

  it('should throw if no email is provided', () => {
    const { sut } = makeSut()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('email'))
  })

})
