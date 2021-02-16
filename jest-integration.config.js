/* eslint-disable @typescript-eslint/no-var-requires */

const config = require(`./jest.config.js`)
config.testMatch = [
  '<rootDir>/test/**/*.test.ts',
  '<rootDir>/test/**/*.spec.ts',
]
module.exports = config
