/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    // TODO: figure out why this blows up on Vue components
    // 'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'dot-notation': ['error', { 'allowPattern': '^[A-Z]' }],
    'no-unused-vars': 'off',
    'object-shorthand': ['error', 'consistent-as-needed'],
    '@typescript-eslint/no-unused-vars': ['warn', { 'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_' }],
    'vue/html-closing-bracket-spacing': 0,
    'vue/max-attributes-per-line': 0,
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 0
  }
}
