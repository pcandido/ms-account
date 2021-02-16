import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {

  it('should return false if Validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValidEmail = sut.isValid('invailid_email@mail.com')
    expect(isValidEmail).toBeFalsy()
  })

})
