import { AddAccountRepository } from '@data/protocols/db/add-account-repository'
import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { Encrypter } from '@data/protocols/cryptography/encrypter'

export class DbAddAccount implements AddAccount {

  constructor(
    private encrypter: Encrypter,
    private addAccountRepository: AddAccountRepository,
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(account.password)
    const added = await this.addAccountRepository.add({ ...account, password: encryptedPassword })
    return added
  }

}
