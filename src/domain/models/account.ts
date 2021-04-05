import { ImageSet } from './image'

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  image?: ImageSet
}

export interface AccountPublicModel {
  id: string
  name: string
  email: string
}
