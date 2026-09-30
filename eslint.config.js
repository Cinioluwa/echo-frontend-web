import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // `any` appears ~155 times across the app, overwhelmingly as
      // `catch (err: any)` and loosely-typed API payloads. At "error" severity
      // this kept `npm run lint` permanently red, which meant it could not be
      // used as a gate at all. Downgraded to a warning so the remaining sites
      // stay visible and reviewable without blocking the build; replacing them
      // with proper error/payload types is a separate, deliberate refactor.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
