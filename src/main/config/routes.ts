import { Express } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {

  fg.sync('routes/**-routes.ts', {
    cwd: 'src/main',
  })
    .forEach(async route => {
      const routeModule = await import(`@main/${route}`)
      app.use(routeModule.default())
    })

}
