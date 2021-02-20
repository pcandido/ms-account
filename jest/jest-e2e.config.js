/* eslint-disable @typescript-eslint/no-var-requires */

const config = require(`./jest-default.config.js`)

module.exports = {
  ...config,
  displayName: 'e2e',
  testMatch: [
    '<rootDir>/src/**/*.e2e.test.ts',
    '<rootDir>/src/**/*.e2e.spec.ts',
  ],
}
