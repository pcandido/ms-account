import { MongoHelper } from '@infra/db/mongodb/helpers/mogodb-helper'
import { AddAccountRepository } from '@data/protocols/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models'

export class AccountMongoRepository implements AddAccountRepository {

  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne({ ...account })
    const { _id, ...accountWithoutId } = result.ops[0]
    return { ...accountWithoutId, id: _id }
  }

}
