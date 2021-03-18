import { AddAccountRepository } from '@usecases/protocols/db/account/add-account-repository'
import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { Hasher } from '@usecases/protocols/cryptography/hasher'

export class DbAddAccount implements AddAccount {

  constructor(
    private hasher: Hasher,
    private addAccountRepository: AddAccountRepository,
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const added = await this.addAccountRepository.addAccount({ ...account, password: hashedPassword })
    return added
  }

}
