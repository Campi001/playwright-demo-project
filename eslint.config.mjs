import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const compatConfigs = compat.extends(
  'eslint:recommended',
  'plugin:import/recommended',
  'plugin:import/typescript',
  'plugin:@typescript-eslint/recommended',
  'plugin:promise/recommended',
  'plugin:prettier/recommended',
);

export default [
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
  },
  ...compatConfigs,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.base.json'],
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'class-methods-use-this': 'off',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-param-reassign': ['error', { props: false }],
      'no-duplicate-imports': 'error',
      'import/no-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/tests/**',
            '**/playwright.config.ts',
            '**/vitest.config.ts',
            '**/vite.config.ts',
          ],
        },
      ],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
