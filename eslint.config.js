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
      /* 🔥 YOUR CUSTOM RULES HERE */

      // Example style rules
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],

      // Safer defaults
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Prefer TS over JS rules
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },

  // Disable formatting rules (let Prettier handle it)
  prettierConfig
];
