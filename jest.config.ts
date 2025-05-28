module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // ajusta si usas aliases con tsconfig.json
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  reporters: [
    "default", // Reporter por defecto (consola)
    [
      "jest-html-reporter",
      {
        outputPath: "./test-results/report.html", // Ruta de salida
        pageTitle: "Reporte de Pruebas Unitarias",
        includeFailureMsg: true, // Muestra mensajes de error
        includeConsoleLog: true, // Incluye logs de la consola
        verbose: true, // Detalles extendidos
      },
    ],
  ],
};
