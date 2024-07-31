import react from 'eslint-plugin-react'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [{
  ignores: ['src/serviceWorker.js', 'build/*']
}, ...compat.extends('eslint:recommended', 'plugin:react/recommended', 'standard'), {
  plugins: {
    react,
    jest
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...jest.environments.globals.globals
    },

    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  settings: {
    react: {
      version: 'detect'
    }
  },

  rules: {
    'max-len': ['error', {
      code: 100
    }]
  }
}]
