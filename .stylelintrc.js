// https://stylelint.io/user-guide/configure
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['layer', 'apply', 'variants', 'responsive', 'screen']
      }
    ],
    'no-descending-specificity': null,
    'selector-class-pattern': null
  }
}
