import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class DbRefreshToken implements RefreshToken {

  constructor(
    private tokenVerifier: TokenVerifier,
    private tokenDecoder: TokenDecoder,
  ) { }

  async refresh(refreshToken: string): Promise<TokenSet | null> {
    const isValid = this.tokenVerifier.verify(refreshToken)
    if (!isValid) return null

    const payload = this.tokenDecoder.decode(refreshToken)






    return { accessToken: '', refreshToken: '' }
  }

}
