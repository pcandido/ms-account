/* eslint-disable @typescript-eslint/no-var-requires */

const tsPreset = require('ts-jest/jest-preset')
const jestMongoPreset = require('@shelf/jest-mongodb/jest-preset')

const path = require('path')
const root = path.resolve(__dirname, '..')

module.exports = {
  rootDir: root,
  roots: ['<rootDir>/src'],

  ...tsPreset,
  ...jestMongoPreset,

  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
}
