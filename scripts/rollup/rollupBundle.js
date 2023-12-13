const { rollup } = require("rollup");
const { input, output, plugins } = require("./rollupConfig.js");
const emptyDirectory = require("../utils/emptyDirectory.js");

const inputOptions = { input, plugins };

const MANUAL_BUILD = process.argv[2] === "--manual";

const generateOutputs = async (bundle) => {
  for (const outputOptions of output) {
    await bundle.write(outputOptions);
  }
};

const build = async (callback) => {
  let bundle;
  let buildFailed = false;

  try {
    // emptyDirectory(__dirname, "../../dist");

    bundle = await rollup(inputOptions);

    await generateOutputs(bundle);

    if (typeof callback === "function") callback();
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }

  if (bundle) {
    await bundle.close();
  }

  if (MANUAL_BUILD) process.exit(buildFailed ? 1 : 0);
};

if (MANUAL_BUILD) build();
else module.exports = build;
