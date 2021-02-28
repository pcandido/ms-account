import { SignUpController } from './signup'
import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountModel } from '@domain/usecases'
import { badRequest, created, serverError } from '@presentation/helpers/http-helper'
import { Validator } from '@presentation/helpers/validation/validator'
import { ValidationError } from '@presentation/errors'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
}

const givenGeneratedId = 'generated_id'
const givenName = 'any name'
const givenEmail = 'any_email@mail.com'
const givenPassword = 'any_password'

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        id: givenGeneratedId,
        ...account,
      })
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validatorStub = makeValidatorStub()
  const sut = new SignUpController(addAccountStub, validatorStub)

  return { sut, addAccountStub, validatorStub }
}

const makeRequest = () => ({
  body: {
    name: givenName,
    email: givenEmail,
    password: givenPassword,
    passwordConfirmation: givenPassword,
  },
})

describe('SingUpController', () => {

  it('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenRequest = makeRequest()

    await sut.handle(givenRequest)
    expect(validateSpy).toBeCalledWith(givenRequest.body)
  })

  it('should reuturn bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new ValidationError('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(badRequest(givenError))
  })

  it('should reuturn 500 if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const givenRequest = makeRequest()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(givenRequest)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith({
      name: givenName,
      email: givenEmail,
      password: givenPassword,
    })
  })

  it('should return 500 if addAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('any_error')
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(givenError)

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = makeRequest()

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(created({
      id: givenGeneratedId,
      name: givenName,
      email: givenEmail,
      password: givenPassword,
    }))
  })

})
