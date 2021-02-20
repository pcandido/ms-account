import path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@main': path.join(files, 'src', 'main'),
  '@presentation': path.join(files, 'src', 'presentation'),
  '@domain': path.join(files, 'src', 'domain'),
  '@data': path.join(files, 'src', 'data'),
  '@infra': path.join(files, 'src', 'infra'),
  '@utils': path.join(files, 'src', 'utils'),
})
