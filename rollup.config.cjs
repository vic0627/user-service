const babel = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
// const cleanup = require("rollup-plugin-cleanup");

module.exports = {
    input: "src/index.ts",
    output: [
        {
            name: "us",
            file: "./dist/user-service.js",
            format: "iife",
            // plugins: [cleanup({ extensions: [".ts", ".js"] })],
        },
        {
            name: "us",
            file: "./dist/user-service.esm.js",
            format: "es",
            // plugins: [cleanup({ extensions: [".ts", ".js"] })],
        },
        {
            name: "us",
            file: "./dist/user-service.min.js",
            format: "iife",
            plugins: [terser()],
        },
    ],
    plugins: [
        babel({
            extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts"],
        }),
        typescript(),
        nodeResolve(),
    ],
};
