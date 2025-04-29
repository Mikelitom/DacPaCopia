/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
    moduleNameMapper: {
      // ajusta esta ruta si tu import en el componente es distinto
      '^\\.{2}/\\.{2}/lib/supabaseClient$': '<rootDir>/lib/__mocks__/supabaseClient.ts'
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    testMatch: ['<rootDir>/**/__tests__/**/*.(test|spec).{js,ts,tsx}', '<rootDir>/**/*.(test|spec).{js,ts,tsx}'],
  };
  