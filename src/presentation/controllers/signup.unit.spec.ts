import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { EmailValidator } from '@presentation/protocols'
import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountModel } from '@domain/usecases'
import { badRequest, created, serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
  sut: SignUpController,
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        id: 'generated_id',
        ...account,
      })
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {

  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
}

interface AccountRequest {
  email: string
  name: string
  password: string
  passwordConfirmation: string
}

const makeHttpRequest = () => ({
  request: {
    body: {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  } as { body: Partial<AccountRequest> },

  with(attribute: keyof AccountRequest, value: string) {
    this.request.body[attribute] = value
    return this
  },

  without(attribute: keyof AccountRequest) {
    delete this.request.body[attribute]
    return this
  },

  build(): { body: Partial<AccountRequest> } {
    return this.request
  },
})

describe('SingUpController', () => {

  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('name').build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('email').build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('password').build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('passwordConfirmation').build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().with('passwordConfirmation', 'different_password').build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenHttpRequest = makeHttpRequest().build()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenInvalidEmail = 'invalid_email@mail.com'
    const givenHttpRequest = makeHttpRequest().with('email', givenInvalidEmail).build()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    await sut.handle(givenHttpRequest)

    expect(isValidSpy).toHaveBeenCalledTimes(1)
    expect(isValidSpy).toHaveBeenCalledWith(givenInvalidEmail)
  })

  it('should return 500 if email validator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenHttpRequest = makeHttpRequest().build()
    const givenError = new Error('any_error')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => { throw givenError })

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(serverError(givenError))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const givenName = 'any_name'
    const givenEmail = 'any_email@mail.com'
    const givenPassword = 'any_password'
    const givenHttpRequest = makeHttpRequest()
      .with('name', givenName)
      .with('email', givenEmail)
      .with('password', givenPassword)
      .with('passwordConfirmation', givenPassword)
      .build()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(givenHttpRequest)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith({
      name: givenName,
      email: givenEmail,
      password: givenPassword,
    })
  })

  it('should return 500 if addAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut()
    const givenHttpRequest = makeHttpRequest().build()
    const givenError = new Error('any_error')
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(givenError)

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(serverError(givenError))
  })

  it('should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const givenName = 'any_name'
    const givenEmail = 'given_email'
    const givenPassword = 'given_password'
    const givenHttpRequest = makeHttpRequest()
      .with('name', givenName)
      .with('email', givenEmail)
      .with('password', givenPassword)
      .with('passwordConfirmation', givenPassword)
      .build()

    const httpResponse = await sut.handle(givenHttpRequest)
    expect(httpResponse).toEqual(created({
      id: 'generated_id',
      name: givenName,
      email: givenEmail,
      password: givenPassword,
    }))
  })

})
