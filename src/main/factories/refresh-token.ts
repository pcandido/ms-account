import config from '@utils/config'
import { AuthenticatedController } from '@controllers/protocols'
import { AuthenticatedControllerLogger } from '@controllers/decorators/controller-logger'
import { JwtAdapter } from '@gateways/adapters/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { RefreshTokenUseCase } from '@usecases/usecases/refresh-token/refresh-token-usecase'
import { refreshTokenValidator } from '@controllers/controllers/refresh/refresh-token-validator'
import { RefreshTokenController } from '@controllers/controllers/refresh/refresh-token'

export const makeRefreshTokenController = (): AuthenticatedController => {
  const loadByEmailRepository = new AccountMongoRepository()
  const jwtSecretPhrase = config.app.jwt.secret
  const tokenGeneratorAndDecoder = new JwtAdapter(jwtSecretPhrase)
  const refreshToken = new RefreshTokenUseCase(tokenGeneratorAndDecoder, loadByEmailRepository, tokenGeneratorAndDecoder)
  const validator = refreshTokenValidator()
  const refreshTokenController = new RefreshTokenController(validator, refreshToken)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new AuthenticatedControllerLogger(refreshTokenController, consoleLoggerAdapter)
}
