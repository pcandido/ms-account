import { Express } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {

  readdirSync(path.join(__dirname, '..', 'routes'))
    .filter(a => a.match(/-routes.[tj]s$/))
    .forEach(async route => {
      const routeModule = await import(`@main/routes/${route}`)
      app.use(routeModule.default())
    })

}
