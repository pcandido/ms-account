import { AccountPublicModel, TokenSet } from '@domain/models'

export interface RefreshToken {

  refresh(account: AccountPublicModel, efreshToken: string): Promise<TokenSet | null>

}
