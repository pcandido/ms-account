import jwt from 'jsonwebtoken'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { TokenSet } from '@domain/models'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import config from '@utils/config'

interface Expiration {
  accessToken: string
  shortRefreshToken: string
  longRefreshToken: string
}

export class JwtAdapter implements TokenSetGenerator, TokenDecoder {

  private expiration: Expiration

  constructor(
    private secretPhrase: string,
  ) {
    this.expiration = config.app.jwt.expiration
  }

  generateSet(data: any, remember: boolean): TokenSet {
    const refreshTokenExpiration = remember ? this.expiration.longRefreshToken : this.expiration.shortRefreshToken
    const accessToken = jwt.sign({ ...data, tokenType: 'access', remember }, this.secretPhrase, { expiresIn: '10 minutes' })
    const refreshToken = jwt.sign({ ...data, tokenType: 'refresh', remember }, this.secretPhrase, { expiresIn: refreshTokenExpiration })
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
