import '../utils/module-aliases'
import config from 'config'
import { MongoHelper } from '@gateways/db/mongodb/helpers/mogodb-helper'


async function start() {

  const mongodbUrl = config.get<string>('mongodb.url')
  await MongoHelper.connect(mongodbUrl)

  const port = config.get('app.port')
  const app = (await import('@main/config/app')).default

  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`)
  })

}

try {
  start()
} catch (e) {
  console.error(e)
}
