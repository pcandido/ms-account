import '../utils/module-aliases'
import config from '@utils/config'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { QueueHelper } from '@gateways/helpers/queue-helper'


async function start() {

  await MongoHelper.connect(config.mongodb.url)
  await QueueHelper.connect(config.rabbitmq.host)

  const port = config.app.port
  const app = (await import('@main/config/app')).default

  app.listen(port, () => {
    console.log(`Server runing at http://localhost:${port}`)
  })

}

start()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
