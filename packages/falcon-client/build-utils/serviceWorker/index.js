const path = require('path');
const Logger = require('@deity/falcon-logger');
const chalk = require('chalk');
const fs = require('fs-extra');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const re = require('rollup-plugin-re');
const alias = require('rollup-plugin-alias');
const paths = require('../paths');
const { getManifestEntries } = require('./workbox');

const getRePatternList = (NODE_ENV, buildConfig, manifestEntries) => [
  { test: 'process.env.NODE_ENV', replace: JSON.stringify(NODE_ENV) },
  {
    test: 'const CONFIG = {};',
    replace: `const CONFIG = ${JSON.stringify(buildConfig, null, 2)};`
  },
  { test: 'const ENTRIES = [];', replace: `const ENTRIES = ${JSON.stringify(manifestEntries, null, 2)};` }
];

/**
 * @param {import('../webpack/tools').FalconSWBuildConfig} buildConfig
 */
module.exports.build = async buildConfig => {
  Logger.info('Compiling Service Worker...');

  const { NODE_ENV } = process.env;
  const IS_PROD = NODE_ENV === 'production';
  const SW_DIR = IS_PROD ? paths.appBuildPublic : paths.appBuild;

  const input = fs.existsSync(paths.appSwJs) ? paths.appSwJs : paths.ownSwJs;

  try {
    const manifestEntries = buildConfig.precache ? await getManifestEntries() : [];

    const inputOptions = {
      input,
      plugins: [
        alias({ 'app-path': paths.appPath }),
        nodeResolve(),
        re({ patterns: getRePatternList(NODE_ENV, buildConfig, manifestEntries) }),
        IS_PROD && terser()
      ].map(x => x),
      treeshake: IS_PROD
    };

    const outputOptions = {
      file: path.join(SW_DIR, 'sw.js'),
      format: 'iife',
      sourcemap: IS_PROD ? true : 'inline',
      compact: IS_PROD
    };

    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);

    Logger.info('Service Worker compiled.\n');
  } catch (error) {
    Logger.error(chalk.red(`Failed to compile Service Worker\n${input}`));
    Logger.error(error);
    Logger.info();

    process.exit(1);
  }
};

/**
 * //TODO: implement real watching
 * @param {import('../webpack/tools').FalconSWBuildConfig} buildConfig
 */
module.exports.watch = async buildConfig => {
  Logger.info('Compiling Service Worker...');

  const { NODE_ENV } = process.env;
  const IS_PROD = NODE_ENV === 'production';
  const SW_DIR = IS_PROD ? paths.appBuildPublic : paths.appBuild;

  if (buildConfig.precache) {
    Logger.warn('Precache is not supported while DEVELOPMENT SERVER, so it will be ignored');
    buildConfig.precache = false;
  }

  const input = fs.existsSync(paths.appSwJs) ? paths.appSwJs : paths.ownSwJs;

  try {
    const manifestEntries = [];

    const inputOptions = {
      input,
      plugins: [
        alias({ 'app-path': paths.appPath }),
        nodeResolve(),
        re({ patterns: getRePatternList(NODE_ENV, buildConfig, manifestEntries) })
      ].map(x => x)
    };

    const outputOptions = {
      file: path.join(SW_DIR, 'sw.js'),
      format: 'iife',
      sourcemap: !IS_PROD,
      compact: IS_PROD
    };

    const watcher = rollup.watch({
      ...inputOptions,
      output: outputOptions,
      watch: {}
    });

    watcher.on('event', event => {
      switch (event.code) {
        case 'BUNDLE_END':
          Logger.info(`Service Worker compiled in ${event.duration / 1000}s.`);
          break;

        case 'FATAL':
        case 'ERROR':
          Logger.error(`Service Worker build error.`);
          Logger.error(event.error);
          break;

        default:
          break;
      }
    });
  } catch (error) {
    Logger.error(chalk.red(`Failed to compile Service Worker\n${input}`));
    Logger.error(error);
    Logger.info();

    process.exit(1);
  }
};
