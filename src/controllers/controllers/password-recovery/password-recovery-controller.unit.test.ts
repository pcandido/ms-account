
import { PasswordRecoveryController } from './password-recovery-controller'
import { Validator } from '@controllers/protocols'

describe('PasswordRecoveryController', () => {

  it('should call validator with correct values', async () => {

    class ValidatorStub implements Validator {
      validate(input: any) {
        /* do nothing */
      }
    }

    const validatorStub = new ValidatorStub()

    const validateSpy = jest.spyOn(validatorStub, 'validate')


    const sut = new PasswordRecoveryController(validatorStub)

    await sut.handle({
      body: {
        email: 'any@email.com',
      },
    })

    expect(validateSpy).toBeCalledWith({ email: 'any@email.com' })
  })

})
