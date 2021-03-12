import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const givenGeneratedHash = 'generated_hash'

jest.mock('bcrypt', () => ({
  hash() {
    return Promise.resolve(givenGeneratedHash)
  },
  compare() {
    return Promise.resolve(true)
  },
}))

describe('BCryptAdapter', () => {

  const givenSalt = 12

  const makeSut = () => new BCryptAdapter(givenSalt)

  describe('hash method', () => {
    it('should call BCrypt with correct values', async () => {
      const givenValue = 'some_value'
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      const sut = makeSut()
      await sut.hash(givenValue)
      expect(hashSpy).toBeCalledWith(givenValue, givenSalt)
    })

    it('should return the generated hash on success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('some_value')
      expect(hash).toBe(givenGeneratedHash)
    })

    it('should not handle BCrypt errors', async () => {
      const givenError = new Error('some_error')
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(givenError)
      await expect(() => sut.hash('some_value')).rejects.toThrow(givenError)
    })
  })

  describe('compare method', () => {
    it('should call BCrypt with correct values', async () => {
      const givenValue = 'some_value'
      const givenHash = 'some_hash'
      const hashSpy = jest.spyOn(bcrypt, 'compare')
      const sut = makeSut()
      await sut.compare(givenValue, givenHash)
      expect(hashSpy).toBeCalledWith(givenValue, givenHash)
    })

    it('should return the compare result on success', async () => {
      const sut = makeSut()
      const givenCompareResult = false
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(givenCompareResult)
      const result = await sut.compare('some_value', 'some_hash')
      expect(result).toBe(givenCompareResult)
    })

    it('should not handle BCrypt errors', async () => {
      const givenError = new Error('some_error')
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(givenError)
      await expect(() => sut.compare('some_value', 'some_hash')).rejects.toThrow(givenError)
    })
  })
})
