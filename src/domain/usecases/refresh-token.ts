import { PublicAccountModel, TokenSet } from '@domain/models'

export interface RefreshToken {

  refresh(account: PublicAccountModel, efreshToken: string): Promise<TokenSet | null>

}
