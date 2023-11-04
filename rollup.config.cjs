const babel = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");

module.exports = {
    input: "src/index.ts",
    output: [
        {
            name: "us",
            file: "./dist/user-service.js",
            format: "iife",
        },
        {
            name: "us",
            file: "./dist/user-service.min.js",
            format: "iife",
            plugins: [terser()]
        },
    ],
    plugins: [
        babel({
            extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts"],
        }),
        typescript(),
    ],
};
