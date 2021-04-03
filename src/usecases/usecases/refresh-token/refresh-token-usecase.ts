import { TokenDecoder } from '@usecases/protocols/cryptography/token-decoder'
import { TokenGenerator } from '@usecases/protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { PublicAccountModel, TokenSet } from '@domain/models'
import { RefreshToken } from '@domain/usecases'

export class RefreshTokenUseCase implements RefreshToken {

  constructor(
    private tokenDecoder: TokenDecoder,
    private loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private tokenGenerator: TokenGenerator,
  ) { }

  async refresh(account: PublicAccountModel, refreshToken: string): Promise<TokenSet | null> {
    const payload = this.tokenDecoder.decode(refreshToken)
    if (!payload) return null

    const { id, email, tokenType } = payload
    if (tokenType !== 'refresh') return null

    if (id !== account.id) return null

    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!loadedAccount) return null

    const { password, ...accountWithoutPaassword } = loadedAccount
    const tokenSet = this.tokenGenerator.generate(accountWithoutPaassword)

    return tokenSet
  }

}
