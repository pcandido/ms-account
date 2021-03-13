import { TokenSet } from '@domain/models'

export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {

  auth(credentials: AuthenticationModel): Promise<TokenSet | null>

}
