/* eslint-disable @typescript-eslint/no-var-requires */

const config = require(`./jest-default.config.js`)

module.exports = {
  ...config,
  displayName: 'int',
  testMatch: [
    '<rootDir>/src/**/*.int.test.ts',
    '<rootDir>/src/**/*.int.spec.ts',
  ],
}
