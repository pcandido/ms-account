import fs from 'fs'
import path from 'path'

function getSecret(key: string): string | undefined {
  const secretsPath = process.env.SECRECT_PATH || '/run/secrets'
  const secretPath = path.join(secretsPath, key)

  if (fs.existsSync(secretPath))
    return fs.readFileSync(secretPath).toString('utf-8')

  return undefined
}

function getConfig(key: string, defaultValue: string): string {
  const fromEnv = process.env[key]
  if (fromEnv) return fromEnv

  const fromSecret = getSecret(key)
  if (fromSecret) return fromSecret

  return defaultValue
}

function getIntConfig(key: string, defaultValue: number) {
  const value = getConfig(key, defaultValue.toString())
  return parseInt(value)
}

function genConfig() {
  return {
    app: {
      port: getIntConfig('PORT', 5000),
      jwt: {
        secret: getConfig('JWT_SECRET_PHRASE', 'secret_phrase'),
      },
    },
    mongodb: {
      url: getConfig('MONGO_URL', 'mongodb://localhost:27017/ms-account'),
    },
  }
}

export default genConfig()
