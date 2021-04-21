import { passwordRecoveryValidator } from './password-recovery-validator'
import { MissingParamError, InvalidParamError } from '@controllers/errors'
import { Validator, EmailValidator } from '@controllrs/protocols'

interface SutTypes {
  sut: Validator
  emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = passwordRecoveryValidator(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('passwordRecoveryValidator', () => {

  it('should throw if no email is provided', () => {
    const { sut } = makeSut()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('email'))
  })

  it('should throw if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenRequest = { email: 'invalid_email' }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('email'))
  })

  it('should not throw if a valid email is provided', () => {
    const { sut } = makeSut()
    const givenRequest = { email: 'valid@email.com' }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })
  
})
