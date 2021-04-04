/* eslint-disable @typescript-eslint/no-namespace */

import { NextFunction, Request, Response } from 'express'
import { verify, JsonWebTokenError } from 'jsonwebtoken'
import config from '@utils/config'

declare global {
  namespace Express {
    interface Request {
      account?: any
    }
  }
}

export const authentication = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const auth = req.headers.authorization?.match(/^Bearer (.+)/)

    if (auth) {
      const token = auth[1]
      const { tokenType, iat, exp, ...data } = verify(token, config.app.jwt.secret) as { [key: string]: string }

      if (tokenType === 'access') {
        if (data.id && data.name && data.email) {
          req.account = data
        }
      }
    }
  } catch (error) {
    if (!(error instanceof JsonWebTokenError)) {
      throw error
    }
  }

  next()
}
