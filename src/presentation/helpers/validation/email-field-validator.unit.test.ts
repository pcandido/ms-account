import { InvalidParamError } from '@presentation/errors'
import { EmailValidator } from '@presentation/protocols'
import { EmailFieldValidator } from './email-field-validator.ts'

interface SutTypes {
  sut: EmailFieldValidator,
  emailValidatorStub: EmailValidator,
}

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailFieldValidator('emailField', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('EmailFieldValidator', () => {

  const givenEmail = 'any_email@mail.com'

  it('should call EmailValidator with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const givenBody = { emailField: givenEmail }

    sut.validate(givenBody)

    expect(isValidSpy).toBeCalledWith(givenEmail)
  })

  it('should throw if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    const givingBody = { emailField: givenEmail }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('emailField'))
  })

  it('should not throw if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const givingBody = { emailField: givenEmail }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should not throw if field is not present', () => {
    const { sut } = makeSut()
    const givingBody = {}

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should not handle EmailValidator internal errors', () => {
    const { sut, emailValidatorStub } = makeSut()
    const givingBody = { emailField: givenEmail }
    const givenError = new Error('any error')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => { throw givenError })

    expect(() => { sut.validate(givingBody) }).toThrow(givenError)
  })

})
