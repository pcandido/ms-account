import '../utils/module-aliases'
import app from '@main/config/app'
import config from 'config'

const port = config.get('app.port')

app.listen(port, () => {
  console.log(`Server runing at http://localhost:${port}`)
})
