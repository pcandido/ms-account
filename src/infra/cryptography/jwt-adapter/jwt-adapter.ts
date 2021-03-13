import jwt from 'jsonwebtoken'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { TokenSet } from '@domain/models'

export class JwtAdapter implements TokenGenerator {

  constructor(
    private secretPhrase: string,
  ) { }

  generate(data: any): TokenSet {
    const accessToken = jwt.sign({ ...data, token_type: 'access' }, this.secretPhrase, { expiresIn: '10 minutes' })
    const refreshToken = jwt.sign({ ...data, token_type: 'refresh' }, this.secretPhrase, { expiresIn: '10 days' })
    return { accessToken, refreshToken }
  }

}
