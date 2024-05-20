const { resolve } = require("path");
const root = resolve(__dirname, "..");
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  rootDir: root,
  displayName: "API-tests",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
};
