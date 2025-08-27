/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.(ts|js)", "**/?(*.)+(spec|test).(ts|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        isolatedModules: false,
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,js}",
    "!src/**/*.spec.{ts,js}",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  globalTeardown: "<rootDir>/src/__tests__/teardown.ts",
  testTimeout: 15000,
  forceExit: true,
  detectOpenHandles: true,
};
