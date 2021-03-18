import jwt from 'jsonwebtoken'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { TokenSet } from '@domain/models'
import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'

export class JwtAdapter implements TokenGenerator, TokenDecoder {

  constructor(
    private secretPhrase: string,
  ) { }

  generate(data: any): TokenSet {
    const accessToken = jwt.sign({ ...data, tokenType: 'access' }, this.secretPhrase, { expiresIn: '10 minutes' })
    const refreshToken = jwt.sign({ ...data, tokenType: 'refresh' }, this.secretPhrase, { expiresIn: '10 days' })
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
