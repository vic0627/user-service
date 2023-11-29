module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "@stylistic"],
  root: true,
  env: {
    browser: true,
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "babel.config.js",
    "jest.config.js",
    "rollup.config.cjs",
    "rollup.config.js",
    "dist",
    "public",
    "example",
    "scripts"
  ],
  rules: {
    semi: 2,
    curly: 2,
    quotes: [2, "double"],
    "no-console": [2, { allow: ["warn", "error", "table", "group", "groupEnd"] }],
    "no-var": 2,
    "padding-line-between-statements": [
      2,
      {
        blankLine: "always",
        prev: ["let", "const", "expression"],
        next: ["block-like", "block"],
      },
      {
        blankLine: "always",
        prev: ["block-like", "block"],
        next: "*",
      },
      {
        blankLine: "always",
        prev: "expression",
        next: ["return", "throw"],
      },
    ],
    "spaced-comment": 2,
    "@stylistic/max-len": [2, 120],
    // "@stylistic/indent": [2, 2],
    "@stylistic/no-multiple-empty-lines": [2, { max: 1 }],
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-unused-vars": 1,
  },
};
