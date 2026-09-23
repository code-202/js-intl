import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'
import react from 'eslint-plugin-react'

export default defineConfig({
    files: ['src/**/*.{ts,tsx}'],
    extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        react.configs.flat.recommended,
        react.configs.flat['jsx-runtime'],
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',

        // These rules don't add much value, are better covered by TypeScript and good definition files
        'react/no-direct-mutation-state': 'off',
        'react/no-deprecated': 'off',
        'react/no-string-refs': 'off',
        'react/require-render-return': 'off',
        'react/display-name': 'off',

        'react/no-unescaped-entities': 'off',
        'react/no-children-prop': 'off',
        'react/prop-types': 'off' // Is this incompatible with TS props type?
    },
    settings: {
        react: {
            version: '19' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    }
})
