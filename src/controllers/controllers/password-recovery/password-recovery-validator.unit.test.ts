import { passwordRecoveryValidator } from './password-recovery-validator'
import { MissingParamError } from '@controllers/errors'

describe('passwordRecoveryValidator', () => {

  it('should throw if no email is provided', () => {
    const sut = passwordRecoveryValidator()
    const givenRequest = {}
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('email'))
  })

})
