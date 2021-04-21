import jwt from 'jsonwebtoken'
import config from '@utils/config'
import { TokenSet } from '@domain/models'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'

interface Expiration {
  accessToken: string
  shortRefreshToken: string
  longRefreshToken: string
}

export class JwtAdapter implements TokenGenerator, TokenSetGenerator, TokenDecoder {

  private expiration: Expiration

  constructor(
    private secretPhrase: string,
  ) {
    this.expiration = config.app.jwt.expiration
  }

  generate(data: any, expiresInMinutes: number): string {
    return jwt.sign(data, this.secretPhrase, { expiresIn: `${expiresInMinutes} minutes` })
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
