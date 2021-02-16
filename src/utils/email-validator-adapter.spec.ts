import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

describe('EmailValidatorAdapter', () => {

  jest.mock('validator', () => ({
    isEmail(): boolean {
      return true
    },
  }))

  it('should return false if Validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = new EmailValidatorAdapter()
    const isValidEmail = sut.isValid('invailid_email@mail.com')
    expect(isValidEmail).toBeFalsy()
  })

  it('should return true if Validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValidEmail = sut.isValid('invailid_email@mail.com')
    expect(isValidEmail).toBeTruthy()
  })

})
