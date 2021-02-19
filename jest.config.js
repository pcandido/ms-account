/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
}
