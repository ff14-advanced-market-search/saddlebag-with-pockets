// @ts-check
import js from '@eslint/js'
import remixConfig from '@remix-run/eslint-config'

export default [
  js.configs.recommended,
  ...remixConfig,
]
