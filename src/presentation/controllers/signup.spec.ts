import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '@presentation/errors'
import { EmailValidator } from '@presentation/protocols'
import { DoNothingLogger } from '@service/logger'
import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountModel } from '@domain/usecases'

describe('SingUpController', () => {

  interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
  }

  const makeEmailValidatorStub = () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true
      }
    }

    return new EmailValidatorStub()
  }

  const makeAddAccountStub = () => {
    class AddAccountStub implements AddAccount {
      add(account: AddAccountModel): AccountModel {
        return {
          id: 'generated_id',
          ...account,
        }
      }
    }

    return new AddAccountStub()
  }

  const makeSut = (): SutTypes => {

    const logger = new DoNothingLogger()
    const emailValidatorStub = makeEmailValidatorStub()
    const addAccountStub = makeAddAccountStub()
    const sut = new SignUpController(logger, emailValidatorStub, addAccountStub)

    return { sut, emailValidatorStub, addAccountStub }
  }

  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const givenHttpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'other_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const givenInvalidEmail = 'invalid_email@mail.com'
    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: givenInvalidEmail,
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    sut.handle(givenHttpRequest)

    expect(isValidSpy).toHaveBeenCalledTimes(1)
    expect(isValidSpy).toHaveBeenCalledWith(givenInvalidEmail)
  })

  it('should return 500 if email validator throws an error', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => { throw new Error() })

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const givenName = 'any_name'
    const givenEmail = 'any_email@mail.com'
    const givenPassword = 'any_password'
    const givenHttpRequest = {
      body: {
        name: givenName,
        email: givenEmail,
        password: givenPassword,
        passwordConfirmation: givenPassword,
      },
    }

    sut.handle(givenHttpRequest)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith({
      name: givenName,
      email: givenEmail,
      password: givenPassword,
    })
  })

  it('should return 500 if addAccount throws an error', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementation(() => { throw new Error() })

    const givenHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse = sut.handle(givenHttpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })


})
