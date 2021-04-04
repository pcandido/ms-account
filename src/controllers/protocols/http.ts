import { AccountPublicModel } from '@domain/models'

export interface Response {
  statusCode: number
  body: any
}

export interface Request {
  body?: any
  account?: AccountPublicModel
}

export interface MultiPartFile {
  originalName: string
  size: number
  encoding: string
  mimeType: string
  buffer: Buffer
}
