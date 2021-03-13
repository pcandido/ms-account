export interface AuthenticatedTokens {
  accessToken: string
  refreshToken: string
}

export interface RefreshToken {

  refresh(refreshToken: string): Promise<AuthenticatedTokens>

}
