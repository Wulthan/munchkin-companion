module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: [],
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    semi: ['error', 'never'],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    'no-console': process.env.NODE_ENV === 'production'
      ? ['error', { allow: ['error'] }] : ['warn', { allow: ['error'] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-async-promise-executor': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-globals': 'off',
    'prefer-rest-params': 'error',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': ['error', { allow: [] }],
    'object-curly-newline': ['error', {
      ExportDeclaration: { multiline: true, minProperties: 6 },
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'ignorePackages',
    }],
    'function-paren-newline': 'off',
    'function-call-argument-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'no-continue': 'off',
  },
}
