import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('BCryptAdapter', () => {

  it('should call BCrypt with correct values', async () => {
    const givenValue = 'some_value'
    const givenSalt = 12
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const sut = new BCryptAdapter(givenSalt)
    await sut.encrypt(givenValue)
    expect(hashSpy).toBeCalledWith(givenValue, givenSalt)
  })

})
