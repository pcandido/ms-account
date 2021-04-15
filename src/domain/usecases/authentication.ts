import { TokenSet } from '@domain/models'

export interface AuthenticationModel {
  email: string
  password: string
  remember: boolean
}

export interface Authentication {

  auth(credentials: AuthenticationModel): Promise<TokenSet | null>

}
