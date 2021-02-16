/* eslint-disable @typescript-eslint/no-var-requires */

const config = require(`./jest.config.js`)
config.testMatch = [
  '<rootDir>/src/**/*.test.ts',
  '<rootDir>/src/**/*.spec.ts',
]
module.exports = config
