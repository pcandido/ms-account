import bcrypt from 'bcrypt'
import { Hasher } from '@data/protocols/cryptography/hasher'
import { HashComparer } from '@data/protocols/cryptography/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {

  constructor(private salt: number = 12) { }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
