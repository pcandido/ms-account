import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const givenGeneratedHash = 'generated_hash'

jest.mock('bcrypt', () => ({
  hash() {
    return Promise.resolve(givenGeneratedHash)
  },
}))

describe('BCryptAdapter', () => {


  it('should call BCrypt with correct values', async () => {
    const givenValue = 'some_value'
    const givenSalt = 12
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const sut = new BCryptAdapter(givenSalt)
    await sut.encrypt(givenValue)
    expect(hashSpy).toBeCalledWith(givenValue, givenSalt)
  })

  it('should return the generated hash on success', async () => {
    const givenValue = 'some_value'
    const givenSalt = 12
    const sut = new BCryptAdapter(givenSalt)
    const hash = await sut.encrypt(givenValue)
    expect(hash).toBe(givenGeneratedHash)
  })

})
