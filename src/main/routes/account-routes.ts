import { makeSignUpController } from '@main/factories/signup'
import { adaptRoute } from '@main/adapters/express-request-adapter'
import { Router } from 'express'

export default (): Router => {
  const router = Router()

  router.route('/signup').post(adaptRoute(makeSignUpController()))

  return router
}
