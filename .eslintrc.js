module.exports = {
  'env': {
    'commonjs': true,
    'es2022': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'ignorePatterns': [
    'node_modules/',
    '*/secret-folder/*'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
