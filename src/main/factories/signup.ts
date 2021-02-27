import { AccountMongoRepository } from '@infra/db/mongodb/acount/account-repository'
import { BCryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SignUpController } from '@presentation/controllers/signup'
import { Controller } from '@presentation/protocols'
import { ControllerLogger } from '@presentation/decorators/controller-logger'

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BCryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signupController = new SignUpController(emailValidator, addAccount)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(signupController, consoleLoggerAdapter)
}
