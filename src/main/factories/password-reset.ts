import config from '@utils/config'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { Controller } from '@controllers/protocols'
import { JwtAdapter } from '@gateways/adapters/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { PasswordResetController } from '@controllers/controllers/password-reset/password-reset-controller'
import { passwordResetValidator } from '@controllers/controllers/password-reset/password-reset-validator'
import { PasswordResetUseCase } from '@usecases/usecases/password-reset/password-reset-usecase'
import { BCryptAdapter } from '@gateways/adapters/bcrypt-adapter/bcrypt-adapter'

export const makePasswordResetController = (): Controller => {
  const tokenDecoder = new JwtAdapter(config.app.jwt.secret)
  const loadByEmailRepository = new AccountMongoRepository()
  const hasher = new BCryptAdapter()
  const updateAccountRepository = new AccountMongoRepository()
  const passwordReset = new PasswordResetUseCase(
    tokenDecoder,
    loadByEmailRepository,
    hasher,
    updateAccountRepository,
  )
  const validator = passwordResetValidator()
  const passwordResetController = new PasswordResetController(validator, passwordReset)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(passwordResetController, consoleLoggerAdapter)
}
