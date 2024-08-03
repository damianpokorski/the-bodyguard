import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  projects: [
    '<rootDir>/tests',
    '<rootDir>/examples/azure-functions',
    '<rootDir>/examples/express'
  ]
};

export default config;
