import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { Encrypter } from '@data/protocols/encrypter'

export class DbAddAccount implements AddAccount {

  constructor(private encrypter: Encrypter) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(account.password)
    
    return Promise.resolve(null as any)
  }

}
