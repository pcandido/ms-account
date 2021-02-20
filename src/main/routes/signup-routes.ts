import { Router } from 'express'

export default (): Router => {
  const router = Router()

  router.route('/signup')
    .post((req,res) => {
      res.json({ok:'ok'})
    })

  return router
}
