// jest.config.js
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^axios$': '<rootDir>/src/__mocks__/axios.js',
    },
  };