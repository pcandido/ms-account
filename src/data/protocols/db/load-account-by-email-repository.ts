import { AccountModel } from '@domain/models'

export interface LoadAccountByEmailRepository {

  loadAccountByEmail(email: string): Promise<AccountModel | null>

}
