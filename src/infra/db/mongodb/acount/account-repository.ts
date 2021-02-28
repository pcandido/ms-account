import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'
import { AddAccountRepository } from '@data/protocols/db/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'

export class AccountMongoRepository implements AddAccountRepository {

  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...account })
    return { ...account, id: insertedId }
  }

}
