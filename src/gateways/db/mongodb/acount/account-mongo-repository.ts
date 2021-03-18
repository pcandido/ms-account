import { MongoHelper } from '@gateways/db/mongodb/helpers/mogodb-helper'
import { AddAccountRepository } from '@usecases/protocols/db/account/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { LoadAccountByEmailRepository } from '@usecases/protocols/db/account/load-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {

  async addAccount(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...account })
    return { ...account, id: insertedId }
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (!account) return null

    const { _id, ...accountData } = account
    return { ...accountData, id: _id }
  }

}
