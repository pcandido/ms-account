import { passwordResetValidator } from './password-reset-validator'
import { MissingParamError, InvalidParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

const makeSut = (): Validator => passwordResetValidator()

const givenToken = 'any.token'
const givenPassword = 'any password'

describe('passwordRecoveryValidator', () => {

  it('should throw if no token is provided', () => {
    const sut = makeSut()
    const givenRequest = { password: givenPassword, passwordConfirmation: givenPassword }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('token'))
  })

  it('should throw if no password is provided', () => {
    const sut = makeSut()
    const givenRequest = { token: givenToken, passwordConfirmation: givenPassword }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('password'))
  })

  it('should throw if no passwordConfirmation is provided', () => {
    const sut = makeSut()
    const givenRequest = { token: givenToken, password: givenPassword }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('passwordConfirmation'))
  })

  it('should throw if password and passwordConfirmation do not match', () => {
    const sut = makeSut()
    const givenRequest = { token: givenToken, password: givenPassword, passwordConfirmation: 'other_password' }
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('passwordConfirmation'))
  })

  it('should not throw if all fields were privided and password matches with passwordConfirmation', () => {
    const sut = makeSut()
    const givenRequest = { token: givenToken, password: givenPassword, passwordConfirmation: givenPassword }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
