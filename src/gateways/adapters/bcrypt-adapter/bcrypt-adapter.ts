import bcrypt from 'bcrypt'
import { Hasher } from '@usecases/protocols/cryptography/hasher'
import { HashComparer } from '@usecases/protocols/cryptography/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {

  constructor(private salt: number = 12) { }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
