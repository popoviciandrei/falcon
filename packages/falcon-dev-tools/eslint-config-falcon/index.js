module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint-config-airbnb', 'eslint-config-prettier'],
  plugins: ['react', 'import', 'eslint-plugin-prettier', 'jsdoc', 'jsx-a11y'],
  settings: {
    'import/parser': 'babel-eslint',
    'import/resolver': { node: true },
    jsdoc: {
      tagNamePreference: {
        return: 'returns'
      }
    }
  },
  env: {
    browser: true,
    node: true,
    jest: true
  },
  rules: {
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'global-require': 'off',
    'id-length': [1, { exceptions: ['_', 'e', 't', 'x', 'p', 'm', 'i', 'j'] }],
    'import/default': 'off',
    'import/extensions': ['off', 'never'],
    'import/no-duplicates': ['error', { includeExports: true }],
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/order': ['error', { 'newlines-between': 'never' }],
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': ['off', { components: ['Link'] }],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: { every: ['id'] },
        allowChildren: false
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'no-alert': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
    'one-var': 'off',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true
      },
      { enforceForRenamedProperties: false }
    ],
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        singleQuote: true,
        printWidth: 120
      }
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/no-danger': 'off',
    'react/no-multi-comp': 'off',
    'react/require-default-props': ['off'],
    'react/no-access-state-in-setstate': 'error',
    'react/prop-types': 'off',
    'react/forbid-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'jsdoc/check-alignment': 1,
    'jsdoc/check-indentation': 1,
    'jsdoc/check-param-names': 1,
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/require-hyphen-before-param-description': [1, 'never'],
    'jsdoc/newline-after-description': [1, 'never'],
    'jsdoc/require-param': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-type': 1
  },
  globals: {
    __DEVELOPMENT__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __DEVTOOLS__: true,
    socket: true,
    webpackIsomorphicTools: true
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-globals': 'off',
        'react/prefer-stateless-function': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-use-before-define': 'off',
        'no-continue': 'off',
        'dot-notation': 'off',
        'react/prop-types': 'off',
        'import/order': 1,
        'import/prefer-default-export': 'off'
      }
    }
  ]
};
