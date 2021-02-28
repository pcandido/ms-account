import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { Validator } from '@presentation/helpers/validation/validator'
import { EmailValidator } from '@presentation/protocols'
import { signupValidator } from './signup-validator'

interface SutTypes {
  sut: Validator
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = signupValidator(emailValidatorStub)
  return { sut, emailValidatorStub }
}

interface AccountRequest {
  email: string
  name: string
  password: string
  passwordConfirmation: string
}

const makeHttpRequest = () => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  } as Partial<AccountRequest>,

  with(attribute: keyof AccountRequest, value: string) {
    this.body[attribute] = value
    return this
  },

  without(attribute: keyof AccountRequest) {
    delete this.body[attribute]
    return this
  },

  build(): Partial<AccountRequest> {
    return this.body
  },
})

describe('SingUpValidator', () => {

  it('should throw if no name is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('name').build()
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('name'))
  })

  it('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('email').build()
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('email'))
  })

  it('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('password').build()
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('password'))
  })

  it('should throw if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().without('passwordConfirmation').build()
    expect(() => sut.validate(givenHttpRequest)).toThrow(new MissingParamError('passwordConfirmation'))
  })

  it('should throw if password confirmation fails', async () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().with('passwordConfirmation', 'different_password').build()
    expect(() => sut.validate(givenHttpRequest)).toThrow(new InvalidParamError('passwordConfirmation'))
  })

  it('should throw if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const givenHttpRequest = makeHttpRequest().build()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    expect(() => sut.validate(givenHttpRequest)).toThrow(new InvalidParamError('email'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenHttpRequest = makeHttpRequest().build()
    expect(() => sut.validate(givenHttpRequest)).not.toThrow()
  })

})
