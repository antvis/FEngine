module.exports = {
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx,js}',
    '!packages/f-engine/src/canvas/render/css-layout.ts',
    '!packages/f-engine/src/canvas/timeline.ts',
    '!packages/f-my/src/**/*.{ts,tsx,js}',
    '!packages/f-wx/src/**/*.{ts,tsx,js}',
    '!packages/f-test-utils/src/**/*.{ts,tsx,js}',
    '!packages/f-vue/src/**/*.{ts,tsx,js}',
    '!**/node_modules/**',
  ],
  modulePathIgnorePatterns: ['packages/*/dist'],
  testPathIgnorePatterns: [],
  testRegex: '/test/.*\\.test\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testTimeout: 10000,
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        allowJs: true,
        target: 'ES2019',
      },
    },
  },
};
