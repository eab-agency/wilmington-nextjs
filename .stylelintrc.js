// https://stylelint.io/user-guide/configure
module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss'],
  ignoreFiles: ['**/AdminToolbar/Toolbar.css'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'no-descending-specificity': null,
    'selector-class-pattern': null
  }
}
