// https://eslint.org/docs/user-guide/configuring/
module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'next', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // 'simple-import-sort/imports': 'error',
    // 'simple-import-sort/exports': 'error',
    '@next/next/no-img-element': 'off',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'warn',
    'no-unused-vars': 'off'
  }
  // overrides: [
  //   // override "simple-import-sort" config
  //   {
  //     files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
  //     rules: {
  //       'simple-import-sort/imports': [
  //         'error',
  //         {
  //           groups: [
  //             // Packages `react` related packages come first.
  //             ['^react', '^@?\\w'],
  //             // Internal packages.
  //             ['^(@|components)(/.*|$)'],
  //             // Side effect imports.
  //             ['^\\u0000'],
  //             // Parent imports. Put `..` last.
  //             ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  //             // Other relative imports. Put same-folder imports and `.` last.
  //             ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  //             // Style imports.
  //             ['^.+\\.?(css)$']
  //           ]
  //         }
  //       ]
  //     }
  //   }
  // ]
}
