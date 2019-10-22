const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const { paths } = require('./tools');

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false;
  }
  const externalPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`);
  return id => externalPattern.test(id);
};

/**
 * Returns  `index.[supportedExtensions]` files
 * @param {string} directory directory to search in
 * @param {string[]} supportedExtensions extensions
 * @returns {string}
 */
function getEntryPointFile(directory, supportedExtensions) {
  const files = glob.sync(`${path.join(directory, 'index')}@(${supportedExtensions.join('|')})`);
  if (files.length > 1) {
    throw new Error(`Directory "${directory}" should contain single entry point 'index.*' file!`);
  }

  if (files.length === 0) {
    console.warn(`No entry point 'index.*' file found in directory '${directory}'. Nothing to compile.`);

    return undefined;
  }

  return files[0];
}

module.exports.main = async () => {
  console.log('building cjs...');

  process.env.ROLLUP = true;

  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  const inputFile = getEntryPointFile(paths.pkgSrc, extensions);
  if (!inputFile) {
    return;
  }

  // eslint-disable-next-line
  const packageJson = require(paths.pkgPackageJson);

  const format = 'cjs';
  const inputOptions = {
    input: inputFile,
    external: makeExternalPredicate([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        runtimeHelpers: true,
        ...require('./babel/babel.config')
      })
    ]
  };
  const outputOptions = { file: packageJson.main, format, sourcemap: true };

  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
};

module.exports.bin = async () => {
  console.log('building cli...');

  process.env.ROLLUP = true;

  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  const inputFile = getEntryPointFile(paths.pkgBinSrc, extensions);
  if (!inputFile) {
    return;
  }

  // eslint-disable-next-line
  const packageJson = require(paths.pkgPackageJson);

  const format = 'cjs';
  const inputOptions = {
    input: inputFile,
    external: makeExternalPredicate([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {})
    ]),
    plugins: [
      replace({
        delimiters: ['', ''],
        '#!/usr/bin/env node': ''
      }),
      nodeResolve({ extensions, preferBuiltins: true }),
      commonjs(),
      babel({
        extensions,
        runtimeHelpers: true,
        ...require('./babel/babel.config')
      })
    ]
  };
  const outputOptions = {
    file: 'dist/bin/index.js',
    banner: '#!/usr/bin/env node',
    format,
    sourcemap: true
  };

  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions, {});

  fs.chmodSync(path.join(paths.pkgPath, outputOptions.file), '755');
};
