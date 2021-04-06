import { AccountPublicModel, ImageSet } from '@domain/models'
import { SetImage } from '@domain/usecases'
import { UpdateAccountRepository } from '@usecases/protocols/account/update-account-repository'
import { ImagePersister } from '@usecases/protocols/image/image-persister'
import { ImageResizer } from '@usecases/protocols/image/image-resizer'

export class SetImageUsecase implements SetImage {

  constructor(
    private imageResizer: ImageResizer,
    private imagePersister: ImagePersister,
    private updateAccountRepository: UpdateAccountRepository,
  ) { }

  async setImage(account: AccountPublicModel, image: Buffer): Promise<ImageSet> {

    const [img64, img256] = await Promise.all([
      this.imageResizer.resize(image, 64, 64),
      this.imageResizer.resize(image, 256, 256),
    ])

    const [uri, uri64, uri256] = await Promise.all([
      this.imagePersister.persist(account.id, image),
      this.imagePersister.persist(`${account.id}_64`, img64),
      this.imagePersister.persist(`${account.id}_256`, img256),
    ])

    const imageSet: ImageSet = { uri, uri64, uri256 }

    await this.updateAccountRepository.updateAccount(account.id, { image: imageSet })

    return imageSet
  }

}
