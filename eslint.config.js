import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true // uses tsconfig.json
      }
    },
    rules: {
      /* 🔥 MIGRATED CUSTOM RULES FROM .eslintrc.cjs */

      // TypeScript-specific rules
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Code style rules (migrated from .eslintrc.cjs)
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'brace-style': ['error', 'allman'],
      'space-before-function-paren': ['error', 'never'],
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
      'init-declarations': ['error', 'always'],
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }],

      // Disabled rules (migrated from .eslintrc.cjs)
      'camelcase': 'off',
      'import/no-absolute-path': 'off',
      'import/no-duplicates': 'off',
      'linebreak-style': 'off',
      'no-multi-spaces': 'off',
      'no-useless-constructor': 'off',
      'no-undef-init': 'off',

      // Prefer TS over JS rules
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },

  // Disable formatting rules (let Prettier handle it)
  prettierConfig,

  // Override specific formatting rules that we want ESLint to handle
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }]
    }
  }
];
