import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import { TokenSetGenerator } from '@usecases/protocols/cryptography/token-set-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { AccountPublicModel, TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class RefreshTokenUseCase implements RefreshToken {

  constructor(
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private tokenSetGenerator: TokenSetGenerator,
  ) { }

  async refresh(account: AccountPublicModel, refreshToken: string): Promise<TokenSet | null> {
    const payload = this.tokenDecoder.decode(refreshToken)
    if (!payload) return null

    const { id, email, tokenType, remember = false } = payload
    if (tokenType !== 'refresh') return null

    if (id !== account.id) return null

    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!loadedAccount) return null

    const { password, ...accountWithoutPaassword } = loadedAccount
    const tokenSet = this.tokenSetGenerator.generateSet(accountWithoutPaassword, remember)

    return tokenSet
  }

}
