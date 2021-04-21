
import { PasswordRecoveryController } from './password-recovery-controller'
import { Validator, Request } from '@controllers/protocols'
import { ValidationError } from '@controllers/errors'
import { ServerError } from '@errors/server-error'
import { PasswordRecovery } from '@domain/usecases'

interface SutTypes {
  sut: PasswordRecoveryController
  validatorStub: Validator
  passwordRecoveryStub: PasswordRecovery
}


const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any) {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makePasswordRecoveryStub = (): PasswordRecovery => {
  class PasswordRecoveryStub implements PasswordRecovery {
    async recover(email: string): Promise<void> {
      /* do nothing */
    }
  }

  return new PasswordRecoveryStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const passwordRecoveryStub = makePasswordRecoveryStub()
  const sut = new PasswordRecoveryController(validatorStub, passwordRecoveryStub)
  return { sut, validatorStub, passwordRecoveryStub }
}

const givenEmail = 'any@email.com'
const makeRequest = (): Request => ({
  body: {
    email: givenEmail,
  },
})

describe('PasswordRecoveryController', () => {

  it('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')

    await sut.handle(makeRequest())

    expect(validateSpy).toBeCalledWith({ email: 'any@email.com' })
  })

  it('should return bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new ValidationError('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 400, body: givenError })
  })

  it('should return server error if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any errror')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 500, body: new ServerError(givenError) })
  })

  it('should call PasswordRecovery usecase with correct params', async () => {
    const { sut, passwordRecoveryStub } = makeSut()
    const recoverySpy = jest.spyOn(passwordRecoveryStub, 'recover')

    await sut.handle(makeRequest())

    expect(recoverySpy).toBeCalledWith(givenEmail)
  })

  it('should return server error if PasswordRecovery usecase throws internal error', async () => {
    const { sut, passwordRecoveryStub } = makeSut()
    const givenError = new Error('any errror')
    jest.spyOn(passwordRecoveryStub, 'recover').mockImplementationOnce(() => { throw givenError })

    const response = await sut.handle(makeRequest())

    expect(response).toEqual({ statusCode: 500, body: new ServerError(givenError) })
  })

  it('should return status code 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual({ statusCode: 200, body: {} })
  })

})
