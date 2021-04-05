import { AccountModel } from '@domain/models/account'

export interface UpdateAccountRepository {

  updateAccount(accountId: string, data: Partial<AccountModel>): Promise<void>

}
