import config from '@utils/config'
import { AuthenticatedController } from '@controllers/protocols'
import { AuthenticatedControllerLogger } from '@controllers/decorators/controller-logger'
import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { SetImageController } from '@controllers/controllers/image/set-image-controller'
import { setImageValidator } from '@controllers/controllers/image/set-image-validator'
import { SetImageUsecase } from '@usecases/usecases/set-image/set-image-usecase'
import { JimpAdapter } from '@gateways/adapters/jimp-adapter/jimp-adapter'
import { S3Adapter } from '@gateways/adapters/s3-adapter/s3-adapter'

export const makeSetImageController = (): AuthenticatedController => {
  const { accessKeyId, secretAccessKey, endpoint, bucketName } = config.s3
  const imageResizer = new JimpAdapter()
  const imagePersister = new S3Adapter(accessKeyId, secretAccessKey, endpoint, bucketName)
  const updateAccountRepository = new AccountMongoRepository()
  const setImage = new SetImageUsecase(imageResizer, imagePersister, updateAccountRepository)
  const validator = setImageValidator()
  const setImageController = new SetImageController(validator, setImage)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new AuthenticatedControllerLogger(setImageController, consoleLoggerAdapter)
}
