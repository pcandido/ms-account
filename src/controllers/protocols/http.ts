export interface RequestAccount {
  id: string
  name: string
  email: string
}

export interface Response {
  statusCode: number
  body: any
}

export interface Request {
  account?: RequestAccount
  body?: any
}

export interface MultiPartFile {
  originalName: string
  size: number
  encoding: string
  mimeType: string
  buffer: Buffer
}
