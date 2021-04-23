import config from '@utils/config'
import { Controller } from '@controllers/protocols'
import { LoginController } from '@controllers/controllers/login/login-controller'
import { loginValidator } from '@controllers/controllers/login/login-validator'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { AuthenticationUseCase } from '@usecases/usecases/authentication/authentication-usecase'
import { BCryptAdapter } from '@gateways/adapters/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@gateways/adapters/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeLoginController = (): Controller => {
  const loadByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BCryptAdapter()
  const jwtSecretPhrase = config.app.jwt.secret
  const tokenSetGenerator = new JwtAdapter(jwtSecretPhrase)
  const authentication = new AuthenticationUseCase(loadByEmailRepository, hashComparer, tokenSetGenerator)
  const emailValidator = new EmailValidatorAdapter()
  const validator = loginValidator(emailValidator)
  const loginController = new LoginController(authentication, validator)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(loginController, consoleLoggerAdapter)
}
