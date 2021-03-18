import { AccountMongoRepository } from '@gateways/db/mongodb/acount/account-mongo-repository'
import { BCryptAdapter } from '@gateways/cryptography/bcrypt-adapter/bcrypt-adapter'
import { DbAddAccount } from '@usecases/usecases/add-account/db-add-account'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SignUpController } from '@controllers/controllers/signup/signup'
import { Controller } from '@controllers/protocols'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { signupValidator } from '@controllers/controllers/signup/signup-validator'

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
