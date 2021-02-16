import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

describe('EmailValidatorAdapter', () => {

  const makeValidatorSpy = (mockedReturn = true) => jest.spyOn(validator, 'isEmail').mockReturnValueOnce(mockedReturn)
  const makeSut = () => new EmailValidatorAdapter()

  it('should return false if Validator returns false', () => {
    makeValidatorSpy(false)
    const sut = makeSut()
    const isValidEmail = sut.isValid('invailid_email@mail.com')
    expect(isValidEmail).toBeFalsy()
  })

  it('should return true if Validator returns true', () => {
    makeValidatorSpy(true)
    const sut = makeSut()
    const isValidEmail = sut.isValid('valid_email@mail.com')
    expect(isValidEmail).toBeTruthy()
  })

  it('should call EmailValidator with correct email', () => {
    const givenEmail = 'any_email@mail.com'
    const isEmailSpy = makeValidatorSpy()
    const sut = makeSut()
    sut.isValid(givenEmail)
    expect(isEmailSpy).toHaveBeenCalledWith(givenEmail)
  })

})
