import config from 'config'
import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers/login/login'
import { loginValidator } from '@presentation/controllers/login/login-validator'
import { ControllerLogger } from '@presentation/decorators/controller-logger'
import { DbAuthentication } from '@data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeLoginController = (): Controller => {
  const loadByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BCryptAdapter()
  const jwtSecretPhrase = config.get<string>('app.jwt.secret')
  const tokenGenerator = new JwtAdapter(jwtSecretPhrase)
  const authentication = new DbAuthentication(loadByEmailRepository, hashComparer, tokenGenerator)
  const emailValidator = new EmailValidatorAdapter()
  const validator = loginValidator(emailValidator)
  const loginController = new LoginController(authentication, validator)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(loginController, consoleLoggerAdapter)
}
