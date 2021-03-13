export interface AuthenticationModel {
  email: string
  password: string
}

export interface AuthenticatedTokens {
  accessToken: string
  refreshToken: string
}

export interface Authentication {

  auth(credentials: AuthenticationModel): Promise<AuthenticatedTokens | null>

}
