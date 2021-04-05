import { MongoHelper } from '@gateways/db/mongodb/helpers/mogodb-helper'
import { AddAccountRepository } from '@usecases/protocols/account/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { LoadAccountByEmailRepository } from '@usecases/protocols/account/load-account-by-email-repository'
import { UpdateAccountRepository } from '@usecases/protocols/account/update-account-repository'
import { ObjectId } from 'bson'

export class AccountMongoRepository implements AddAccountRepository, UpdateAccountRepository, LoadAccountByEmailRepository {

  async addAccount(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...account })
    return { ...account, id: insertedId }
  }

  async updateAccount(accountId: string, data: Partial<AccountModel>): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.findOneAndUpdate({ _id: new ObjectId(accountId) }, { $set: data }, { upsert: false })
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (!account) return null

    const { _id, ...accountData } = account
    return { ...accountData, id: _id }
  }

}
