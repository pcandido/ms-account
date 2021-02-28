import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { Validator } from '@presentation/helpers/validation/validator'
import { EmailValidator } from '@presentation/protocols'
import { loginValidator } from './login-validator'

interface SutTypes {
  sut: Validator
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = loginValidator(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('LoginValidator', () => {

  it('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = { password: 'any_password' }
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('email'))
  })

  it('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = { email: 'any_email@mail.com' }
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('password'))
  })

  it('should throw if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenHttpRequest = { email: 'invalid_email@mail.com', password: 'any_password' }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    expect(() => sut.validate(givenHttpRequest)).toThrow(new InvalidParamError('email'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenHttpRequest = { email: 'any_email@mail.com', password: 'any_password' }
    expect(() => sut.validate(givenHttpRequest)).not.toThrow()
  })

})
