export interface Response {
  statusCode: number
  body: any
}

export interface Request {
  body?: any
}

export interface MultiPartFile {
  originalName: string
  size: number
  encoding: string
  mimeType: string
  buffer: Buffer
}
