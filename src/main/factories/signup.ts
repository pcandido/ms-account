import { AccountMongoRepository } from '@infra/db/mongodb/acount/account-repository'
import { BCryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SignUpController } from '@presentation/controllers/signup'

export const makeSignUpController = (): SignUpController => {
  const logger = new ConsoleLoggerAdapter()
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BCryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  return new SignUpController(logger, emailValidator, addAccount)
}
