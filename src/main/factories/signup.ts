import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { BCryptAdapter } from '@gateways/adapters/bcrypt-adapter/bcrypt-adapter'
import { AddAccountUseCase } from '@usecases/usecases/add-account/add-account-usecase'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SignUpController } from '@controllers/controllers/signup/signup-controller'
import { Controller } from '@controllers/protocols'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { signupValidator } from '@controllers/controllers/signup/signup-validator'

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BCryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new AddAccountUseCase(hasher, addAccountRepository)
  const validator = signupValidator(emailValidator)
  const signupController = new SignUpController(addAccount, validator)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(signupController, consoleLoggerAdapter)
}
