import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator {

  constructor(
    private secretPhrase: string,
  ) { }

  generate(data: any): string {
    return jwt.sign(data, this.secretPhrase)
  }

}
