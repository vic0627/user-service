const babel = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
// const cleanup = require("rollup-plugin-cleanup");
const { resolve } = require("path");

const relativePathToRoot = "../../";

const getPath = (...paths) => resolve(__dirname, relativePathToRoot, ...paths);

const input = getPath("src/index.ts");

const output = [
  {
    name: "us",
    file: getPath("dist/user-service.js"),
    format: "iife",
    exports: "named",
    // plugins: [cleanup({ extensions: [".ts", ".js"] })],
  },
  {
    name: "us",
    file: getPath("dist/user-service.esm.js"),
    format: "es",
    exports: "named",
    // plugins: [cleanup({ extensions: [".ts", ".js"] })],
  },
  {
    name: "us",
    file: getPath("dist/user-service.min.js"),
    format: "iife",
    exports: "named",
    plugins: [terser()],
  },
];

const plugins = [
  babel({
    extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts"],
    babelHelpers: "bundled",
  }),
  typescript(),
  nodeResolve(),
];

module.exports = { input, output, plugins };
