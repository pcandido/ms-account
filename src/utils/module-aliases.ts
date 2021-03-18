import path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..')

moduleAlias.addAliases({
  '@main': path.join(files, 'main'),
  '@controllers': path.join(files, 'controllers'),
  '@domain': path.join(files, 'domain'),
  '@usecases': path.join(files, 'usecases'),
  '@gateways': path.join(files, 'gateways'),
  '@utils': path.join(files, 'utils'),
  '@errors': path.join(files, 'errors'),
})
