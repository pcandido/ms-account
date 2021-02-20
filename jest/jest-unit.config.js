/* eslint-disable @typescript-eslint/no-var-requires */

const config = require(`./jest-default.config.js`)

module.exports = {
  ...config,
  displayName: 'unit',
  testMatch: [
    '<rootDir>/src/**/*.unit.test.ts',
    '<rootDir>/src/**/*.unit.spec.ts',
  ],
}
