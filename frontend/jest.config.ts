import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss)$": "<rootDir>/tests/mocks/styleMock.ts",
  },
};

export default config;
