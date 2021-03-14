import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class DbRefreshToken implements RefreshToken {

  constructor(
    private tokenVerifier: TokenVerifier,
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) { }

  async refresh(refreshToken: string): Promise<TokenSet | null> {
    const isValid = this.tokenVerifier.verify(refreshToken)
    if (!isValid) return null

    const { email } = this.tokenDecoder.decode(refreshToken)
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)






    return { accessToken: '', refreshToken: '' }
  }

}
