import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'
import { AddAccountRepository } from '@data/protocols/db/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {

  async addAccount(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...account })
    return { ...account, id: insertedId }
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { _id, ...account } = await accountCollection.findOne({ email })
    return { ...account, id: _id }
  }

}
