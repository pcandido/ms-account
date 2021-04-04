import { Router } from 'express'
import { adaptAuthenticatedRoute, adaptRoute } from '@main/adapters/express-request-adapter'
import { makeSignUpController } from '@main/factories/signup'
import { makeLoginController } from '@main/factories/login'
import { makeRefreshTokenController } from '@main/factories/refresh-token'

export default (): Router => {
  const router = Router()

  router.route('/signup').post(adaptRoute(makeSignUpController()))
  router.route('/login').post(adaptRoute(makeLoginController()))
  router.route('/refresh-token').post(adaptAuthenticatedRoute(makeRefreshTokenController()))

  return router
}
