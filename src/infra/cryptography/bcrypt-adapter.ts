import bcrypt from 'bcrypt'
import { Encrypter } from '@data/protocols/encrypter'

export class BCryptAdapter implements Encrypter {

  constructor(private salt: number) { }

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return ''
  }

}
