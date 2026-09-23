import { defineConfig } from 'jest'

export default defineConfig({
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                // Cette option est cruciale pour éviter les conflits de modules
                tsconfig: {
                    module: 'ESNext',
                    moduleResolution: 'NodeNext',
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true
                }
            }
        ],
    },
    testMatch: [
        '**/test/**/*.test.ts'
    ],
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
});
