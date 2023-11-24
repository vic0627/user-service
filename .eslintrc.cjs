module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
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
    ],
    rules: {
        semi: 2,
        "@typescript-eslint/ban-types": 0,
        "@typescript-eslint/no-explicit-any": 1,
        "@typescript-eslint/no-unused-vars": 1,
    },
};
