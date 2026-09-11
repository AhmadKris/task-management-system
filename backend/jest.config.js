module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/helpers/globalSetup.js',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  clearMocks: true,
};
