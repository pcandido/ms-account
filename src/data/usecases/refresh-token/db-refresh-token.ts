import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { TokenVerifier } from '@data/protocols/cryptography/token-verifier'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class DbRefreshToken implements RefreshToken {

  constructor(
    private tokenVerifier: TokenVerifier,
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private tokenGenerator: TokenGenerator,
  ) { }

  async refresh(refreshToken: string): Promise<TokenSet | null> {
    const isValid = this.tokenVerifier.verify(refreshToken)
    if (!isValid) return null

    const { email, tokenType } = this.tokenDecoder.decode(refreshToken)
    if (tokenType !== 'refresh') return null

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null

    const { password, ...accountWithoutPaassword } = account
    this.tokenGenerator.generate(accountWithoutPaassword)





    return { accessToken: '', refreshToken: '' }
  }

}
