/* eslint-disable @typescript-eslint/no-var-requires */

const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  displayName: 'root',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@service/(.*)': '<rootDir>/src/service/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
}
