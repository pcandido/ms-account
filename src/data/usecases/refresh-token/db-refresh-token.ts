import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class DbRefreshToken implements RefreshToken {

  constructor(
    private tokenVerifier: TokenVerifier,
  ) { }

  async refresh(refreshToken: string): Promise<TokenSet | null> {
    this.tokenVerifier.verify(refreshToken)







    return null
  }

}
