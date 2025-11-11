// eslint.config.js
import tsParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser, // ✅ parser module, not string
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true, // enable JSX
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettierPlugin,
        },
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            indent: ['error', 4],
            'arrow-parens': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'max-len': ['error', { code: 100 }],
            'eol-last': ['error', 'always'],
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    semi: true,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    arrowParens: 'always',
                    endOfLine: 'lf',
                    printWidth: 100,
                },
            ],
        },
    },
];

