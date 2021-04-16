import jwt from 'jsonwebtoken'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { TokenSet } from '@domain/models'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import config from '@utils/config'

interface Expiration {
  accessToken: string
  shortRefreshToken: string
  longRefreshToken: string
}

export class JwtAdapter implements TokenGenerator, TokenDecoder {

  private expiration: Expiration

  constructor(
    private secretPhrase: string,
  ) {
    this.expiration = config.app.jwt.expiration
  }

  generate(data: any, remember: boolean): TokenSet {
    const refreshTokenExpiration = remember ? this.expiration.longRefreshToken : this.expiration.shortRefreshToken
    const accessToken = jwt.sign({ ...data, tokenType: 'access' }, this.secretPhrase, { expiresIn: '10 minutes' })
    const refreshToken = jwt.sign({ ...data, tokenType: 'refresh' }, this.secretPhrase, { expiresIn: refreshTokenExpiration })
    return { accessToken, refreshToken }
  }

  decode(token: string): any {
    try {
      return jwt.verify(token, this.secretPhrase)
    } catch (error) {
      return null
    }
  }

}
