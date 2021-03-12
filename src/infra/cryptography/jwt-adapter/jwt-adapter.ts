import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator {

  constructor(
    private secretPhrase: string,
  ) { }

  async generate(data: any): Promise<string> {
    jwt.sign(data, this.secretPhrase)
    return ''
  }

}
