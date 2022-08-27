module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: "./",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
  },
  ignorePatterns: ["tests/fixtures"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
};
