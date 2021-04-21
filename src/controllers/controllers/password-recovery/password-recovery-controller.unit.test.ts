
import { PasswordRecoveryController } from './password-recovery-controller'
import { Validator } from '@controllers/protocols'
import { ValidationError, ServerError } from '@controllers/errors'

interface SutTypes {
  sut: PasswordRecoveryController,
  validatorStub: Validator
}


const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any) {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new PasswordRecoveryController(validatorStub)
  return { sut, validatorStub }
}


describe('PasswordRecoveryController', () => {

  it('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')

    await sut.handle({
      body: {
        email: 'any@email.com',
      },
    })

    expect(validateSpy).toBeCalledWith({ email: 'any@email.com' })
  })

  it('should return bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new ValidationError('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle({
      body: {
        email: 'any@email.com',
      },
    })

    expect(response).toEqual({ statusCode: 400, body: givenError })
  })

  it('should return server error if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle({
      body: {
        email: 'any@email.com',
      },
    })

    expect(response).toEqual({ statusCode: 500, body: new ServerError(givenError) })
  })

})
