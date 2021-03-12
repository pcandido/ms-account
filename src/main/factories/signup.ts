import { AccountMongoRepository } from '@infra/db/mongodb/acount/account-repository'
import { BCryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SignUpController } from '@presentation/controllers/signup/signup'
import { Controller } from '@presentation/protocols'
import { ControllerLogger } from '@presentation/decorators/controller-logger'
import { signupValidator } from '@presentation/controllers/signup/signup-validator'

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BCryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(hasher, addAccountRepository)
  const validator = signupValidator(emailValidator)
  const signupController = new SignUpController(addAccount, validator)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(signupController, consoleLoggerAdapter)
}
