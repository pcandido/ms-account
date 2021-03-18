import path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@main': path.join(files, 'src', 'main'),
  '@controllers': path.join(files, 'src', 'controllers'),
  '@domain': path.join(files, 'src', 'domain'),
  '@usecases': path.join(files, 'src', 'usecases'),
  '@gateways': path.join(files, 'src', 'gateways'),
  '@utils': path.join(files, 'src', 'utils'),
  '@errors': path.join(files, 'src', 'errors'),
})
