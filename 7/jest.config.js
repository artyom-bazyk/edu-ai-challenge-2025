export default {
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'node',
    transformIgnorePatterns: [],
    testMatch: ['**/*.test.js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '*.js',
        '!jest.config.js',
        '!coverage/**',
        '!node_modules/**'
    ]
}; 