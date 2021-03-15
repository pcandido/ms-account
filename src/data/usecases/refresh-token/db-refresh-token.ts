import { TokenDecoder } from '@data/protocols/cryptography/token-decoder'
import { TokenGenerator } from '@data/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class DbRefreshToken implements RefreshToken {

  constructor(
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private tokenGenerator: TokenGenerator,
  ) { }

  async refresh(refreshToken: string): Promise<TokenSet | null> {
    const payload = this.tokenDecoder.decode(refreshToken)
    if (!payload) return null

    const { email, tokenType } = payload
    if (tokenType !== 'refresh') return null

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null

    const { password, ...accountWithoutPaassword } = account
    const tokenSet = this.tokenGenerator.generate(accountWithoutPaassword)

    return tokenSet
  }

}
