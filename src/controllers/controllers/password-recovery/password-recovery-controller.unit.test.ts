
import { PasswordRecoveryController } from './password-recovery-controller'
import { Validator } from '@controllers/protocols'
import { ValidationError } from '@controllers/errors'

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

  it('should return bad request if validator throws', async () => {
    class ValidatorStub implements Validator {
      validate(input: any) {
        /* do nothing */
      }
    }

    const validatorStub = new ValidatorStub()

    const givenError = new ValidationError('any errror')

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })


    const sut = new PasswordRecoveryController(validatorStub)

    const response = await sut.handle({
      body: {
        email: 'any@email.com',
      },
    })

    expect(response).toEqual({ statusCode: 400, body: givenError })
  })

})
