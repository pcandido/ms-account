/* eslint-disable @typescript-eslint/no-namespace */

import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '@utils/config'

declare global {
  namespace Express {
    interface Request {
      account?: any
    }
  }
}


export const authentication = (req: Request, res: Response, next: NextFunction): void => {
  if (req.originalUrl.match(/^\/public\//g)) {
    next()
    return
  }

  try {
    const auth = req.headers.authorization?.match(/^Bearer (.+)/)

    if (!auth)
      throw new Error('Authorization header not provided')

    const token = auth[1]
    const { tokenType, iat, exp, ...data } = jwt.verify(token, config.app.jwt.secret) as { [key: string]: string }

    req.account = data

    next()
  } catch (error) {
    res.status(401).send(error.message)
  }
}
