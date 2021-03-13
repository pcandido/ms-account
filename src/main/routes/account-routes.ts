import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-request-adapter'
import { makeSignUpController } from '@main/factories/signup'
import { makeLoginController } from '@main/factories/login'

export default (): Router => {
  const router = Router()

  router.route('/signup').post(adaptRoute(makeSignUpController()))
  router.route('/login').post(adaptRoute(makeLoginController()))

  return router
}
