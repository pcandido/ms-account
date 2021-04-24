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
        expiration: {
          accessToken: getConfig('JWT_ACCESS_TOKEN_EXPIRATION', '10 minutes'),
          shortRefreshToken: getConfig('JWT_SHORT_REFRESH_TOKEN_EXPIRATION', '1 hour'),
          longRefreshToken: getConfig('JWT_LONG_REFRESH_TOKEN_EXPIRATION', '10 days'),
        },
      },
      passwordRecovery: {
        expiresInMinutes: getIntConfig('PASSWORD_RECOVERY_EXPIRES_IN_MINUTES', 24 * 60),
        resetUrl: getConfig('PASSWORD_RESET_URL', 'https://domain.com/password-reset'),
        queueName: getConfig('PASSWORD_RECOVERY_RABBITMQ_QUEUE', 'send-email'),
      },
    },
    rabbitmq: {
      host: getConfig('PASSWORD_RECOVERY_RABBITMQ_HOST', 'localhost'),
    },
    mongodb: {
      url: getConfig('MONGO_URL', 'mongodb://localhost:27017/ms-account'),
    },
    s3: {
      accessKeyId: getConfig('S3_ACCESS_KEY_ID', 'accessKeyId'),
      secretAccessKey: getConfig('S3_SECRET_ACCESS_KEY', 'secretAccessKey'),
      endpoint: getConfig('S3_ENDPOINT', 'http://localhost:4569'),
      bucketName: getConfig('S3_ACCOUNT_IMAGE_BUCKET', 'account-image'),
    },
  }
}

export default genConfig()
