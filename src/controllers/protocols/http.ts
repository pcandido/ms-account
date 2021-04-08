import { AccountPublicModel } from '@domain/models'

export interface Response {
  statusCode: number
  body: any
}

export interface Request {
  body?: any
  account?: AccountPublicModel
}

export interface AuthenticatedRequest {
  body?: any
  account: AccountPublicModel
}

export interface MultiPartFile {
  originalName: string
  size: number
  mimeType: string
  buffer: Buffer
}
