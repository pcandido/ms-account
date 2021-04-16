/* eslint-disable @typescript-eslint/no-var-requires */

const tsPreset = require('ts-jest/jest-preset')
const jestMongoPreset = require('@shelf/jest-mongodb/jest-preset')

const path = require('path')
const root = path.resolve(__dirname, '..')

module.exports = {
  rootDir: root,
  roots: ['<rootDir>/src', '<rootDir>/test'],

  ...tsPreset,
  ...jestMongoPreset,

  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  clearMocks: true,
  testEnvironment: 'node',
  moduleNameMapper: {
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@usecases/(.*)': '<rootDir>/src/usecases/$1',
    '@gateways/(.*)': '<rootDir>/src/gateways/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@errors/(.*)': '<rootDir>/src/errors/$1',
  },
}
