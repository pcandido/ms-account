import { AccountPublicModel, ImageSet } from '@domain/models'

export interface SetImage {
  setImage(image: Buffer, account: AccountPublicModel): Promise<ImageSet>
}
