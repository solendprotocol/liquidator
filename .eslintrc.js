module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  parserOptions: {
    project: ['./tsconfig.eslint.json', './tsconfig.json'],
    ecmaVersion: 2015,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-shadow': 'off',
    'jest/no-focused-tests': 0,
    'class-methods-use-this': 0,
    'no-use-before-define': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': 0,
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'import/prefer-default-export': 0,
    'global-require': 'warn',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['..*'],
      },
    ],
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variableLike',
        custom: {
          regex: '^([Aa]ny|[Nn]umber|[Ss]tring|[Bb]oolean|[Uu]ndefined)$',
          match: false,
        },
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        custom: {
          regex: '^([Aa]ny|[Nn]umber|[Ss]tring|[Bb]oolean|[Uu]ndefined)$',
          match: false,
        },
        format: ['PascalCase'],
      },
    ],
    'max-len': 'off',
    'no-console': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src'],
        paths: 'src',
      },
    },
    // silence dumb react warning
    react: { version: '999.999.999' },
  },
};
