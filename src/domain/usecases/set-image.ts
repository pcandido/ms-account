import { AccountPublicModel, ImageSet } from '@domain/models'

export interface SetImage {
  setImage(account: AccountPublicModel, image: Buffer): Promise<ImageSet>
}
