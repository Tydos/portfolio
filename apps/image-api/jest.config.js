/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/db/migrate.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 25,
      lines: 45,
      statements: 45,
    },
  },
  moduleNameMapper: {
    "^@portfolio/shared-types$":
      "<rootDir>/../../packages/shared-types/src/index.ts",
  },
};
