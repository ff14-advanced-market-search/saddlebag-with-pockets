// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'build/**',
      'public/build/**',
      'node_modules/**',
      '.cache/**',
      'coverage/**',
      'dist/**',
      'functions/**',
      '*.config.js',
      '*.config.ts',
      'eslint.config.js'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // Disable rules that conflict with Prettier or require plugins we don't have
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'react-hooks/exhaustive-deps': 'off', // Plugin not configured
      'no-undef': 'off' // TypeScript handles this
    }
  },
  {
    files: ['app/polyfills.js'],
    rules: {
      'no-undef': 'off' // Polyfill file intentionally uses globals
    }
  }
]
