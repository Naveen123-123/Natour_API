module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb', 'plugin:node/recommended', 'prettier'],
  plugins: ['react', 'jsx-a11y', 'import', 'node', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
      },
    ],
    'no-console': 'off',

    // Express middleware/handlers legitimately mix `return res.send(...)`
    // with bare `next()` / early `return;` — this rule fights that pattern.
    'consistent-return': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],

    // Match this to the actual Node version you deploy on (see package.json
    // "engines" below) — this overrides the plugin's own engines-field check.
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=18.0.0',
        ignores: ['modules'],
      },
    ],
    'node/no-missing-import': 'off',

    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
