module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    "@typescript-eslint/camelCase": 0,
    "@typescript-eslint/naming-convention": 0,
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn"
  },
  ignorePatterns: ['config.js']
};
