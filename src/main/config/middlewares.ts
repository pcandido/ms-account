import { Express } from 'express'
import { authentication, bodyParser, cors, contentType } from '@main/middlewares'
import { fileParser, multerMiddleware } from '@main/middlewares/file-parser'

export default (app: Express): void => {
  app.use(authentication)
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(multerMiddleware, fileParser)
}
