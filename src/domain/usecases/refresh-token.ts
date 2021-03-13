import { TokenSet } from '@domain/models'

export interface RefreshToken {

  refresh(refreshToken: string): Promise<TokenSet>

}
