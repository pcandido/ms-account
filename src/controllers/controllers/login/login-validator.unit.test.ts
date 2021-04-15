import { InvalidParamError, MissingParamError } from '@controllers/errors'
import { EmailValidator, Validator } from '@controllers/protocols'
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
    const givenRequest = { password: 'any_password', remember: false }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('email'))
  })

  it('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = { email: 'any_email@mail.com', remember: false }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('password'))
  })

  it('should throw if no remember option is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = { email: 'any_email@mail.com', password: 'any_password' }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('remember'))
  })

  it('should throw if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenRequest = { email: 'invalid_email@mail.com', password: 'any_password', remember: false }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('email'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenRequest = { email: 'any_email@mail.com', password: 'any_password', remember: false }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
