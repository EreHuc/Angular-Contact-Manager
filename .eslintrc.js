module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: "airbnb-base",
  globals: {
    angular: true
  },
  rules: {
    'global-require': 1,
    'guard-for-in': 1,
    'import/no-dynamic-require': 1,
    'no-console': 1,
    'no-multi-assign': 1,
    'no-param-reassign': 1,
    'no-prototype-builtins': 1,
    'no-underscore-dangle': 0,
    'prefer-rest-params': 1
  }
};