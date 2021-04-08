import { MultiPartFile } from '@controllers/protocols'
import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

export const multerMiddleware = multer({ storage: multer.memoryStorage() }).any()

function parseFile(file: Express.Multer.File): MultiPartFile {
  return {
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    buffer: file.buffer,
  }
}

export const fileParser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      req.body[file.fieldname] = parseFile(file)
    }
  }

  next()
}
