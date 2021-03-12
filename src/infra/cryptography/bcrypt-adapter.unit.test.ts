import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const givenGeneratedHash = 'generated_hash'

jest.mock('bcrypt', () => ({
  hash() {
    return Promise.resolve(givenGeneratedHash)
  },
}))

describe('BCryptAdapter', () => {

  const givenSalt = 12

  const makeSut = () => new BCryptAdapter(givenSalt)

  it('should call BCrypt with correct values', async () => {
    const givenValue = 'some_value'
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    await sut.hash(givenValue)
    expect(hashSpy).toBeCalledWith(givenValue, givenSalt)
  })

  it('should return the generated hash on success', async () => {
    const givenValue = 'some_value'
    const sut = makeSut()
    const hash = await sut.hash(givenValue)
    expect(hash).toBe(givenGeneratedHash)
  })

  it('should not handle BCrypt errors', async () => {
    const givenValue = 'some_value'
    const givenError = new Error('some_error')
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValue(givenError)
    await expect(() => sut.hash(givenValue)).rejects.toThrow(givenError)
  })

})
