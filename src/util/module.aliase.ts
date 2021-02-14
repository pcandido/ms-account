import path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@presentation': path.join(files, 'src', 'presentation'),
  '@service': path.join(files, 'src', 'service'),
  '@test': path.join(files, 'test'),
})
