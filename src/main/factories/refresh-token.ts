import config from 'config'
import { Controller } from '@presentation/protocols'
import { ControllerLogger } from '@presentation/decorators/controller-logger'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { DbRefreshToken } from '@data/usecases/refresh-token/db-refresh-token'
import { refreshTokenValidator } from '@presentation/controllers/refresh/refresh-token-validator'
import { RefreshTokenController } from '@presentation/controllers/refresh/refresh-token'

export const makeRefreshTokenController = (): Controller => {
  const loadByEmailRepository = new AccountMongoRepository()
  const jwtSecretPhrase = config.get<string>('app.jwt.secret')
  const tokenGeneratorAndDecoder = new JwtAdapter(jwtSecretPhrase)
  const refreshToken = new DbRefreshToken(tokenGeneratorAndDecoder, loadByEmailRepository, tokenGeneratorAndDecoder)
  const validator = refreshTokenValidator()
  const refreshTokenController = new RefreshTokenController(validator, refreshToken)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(refreshTokenController, consoleLoggerAdapter)
}
