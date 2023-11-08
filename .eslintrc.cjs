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
    ],
    rules: {
        semi: 2,
    },
};
