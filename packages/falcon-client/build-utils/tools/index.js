const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const deepMerge = require('deepmerge');
const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const Logger = require('@deity/falcon-logger');
const paths = require('../paths');

function requireOrExit(id) {
  try {
    // eslint-disable-next-line
    return require(id);
  } catch (e) {
    clearConsole();
    Logger.error(`File ${path.basename(id)} is invalid (${id}).`, e);
    process.exit(1);
  }
}

/**
 * @typedef {object} FalconClientBuildConfig
 * @property {number} devServerPort webpack dev server port
 * @property {boolean} CI if Continuos Integration env
 * @property {boolean} clearConsole if clear console
 * @property {boolean} useWebmanifest is process Web App Manifest
 * @property {FalconSWBuildConfig} serviceWorker service Worker specific configuration
 * @property {object} i18n i18n falcon client webpack plugin configuration
 * @property {string[]} envToBuildIn env vars to build in bundle
 * @property {(Function|string)[]} plugins razzle compatible plugins
 * @property {object} moduleOverride dictionary of module names to override
 */

/**
 * @typedef {object} FalconSWBuildConfig
 * @property {boolean} precache if Workbox precache
 */

/**
 * Get falcon-client build config
 * @param {string} buildConfigFileName `falcon-client.build.config.js` falcon-client build time config relative path
 * @returns {FalconClientBuildConfig} falcon-client build time config
 */
function getBuildConfig(buildConfigFileName = 'falcon-client.build.config.js') {
  const buildConfigFilePath = paths.resolveApp(buildConfigFileName);
  const buildConfig = fs.existsSync(buildConfigFilePath) ? requireOrExit(buildConfigFilePath) : {};

  const buildConfigDefaults = {
    clearConsole: true,
    CI: false,
    devServerPort: 3001,
    useWebmanifest: false,
    serviceWorker: {
      precache: process.env.NODE_ENV === 'production',
      blacklistRoutes: ['/sw.js(.*)']
    },
    i18n: {},
    envToBuildIn: [],
    plugins: [],
    moduleOverride: {}
  };

  const config = deepMerge(buildConfigDefaults, buildConfig, {
    arrayMerge: (destination, source) => [...new Set([...destination, ...source])]
  });

  return config;
}

function exitIfBuildingItself() {
  if (paths.ownPath === paths.appPath) {
    Logger.error(
      chalk.red(
        'Error: falcon-client is not intended to starting or building itself. It hosts your application instead!\n'
      )
    );
    Logger.info(
      "If you don't known how to start see this: https://github.com/deity-io/falcon/tree/master/packages/create-falcon-app"
    );
    Logger.info(
      'If you want more information about falcon-client see this: https://github.com/deity-io/falcon/tree/master/packages/falcon-client'
    );

    process.exit(1);
  }
}

/**
 * Exit if required files does no exist
 * @param {FalconClientBuildConfig} config falcon-client build config
 * @returns {void}
 */
function exitIfNoRequiredFiles(config) {
  const filesToCheck = [paths.appIndexJs, config.useWebmanifest && paths.appWebmanifest].filter(x => x);
  if (!checkRequiredFiles(filesToCheck)) {
    process.exit(1);
  }
}

function getFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    const rs = fs.createReadStream(filePath);
    rs.on('error', reject);
    rs.on('data', chunk => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports = {
  getBuildConfig,
  exitIfBuildingItself,
  exitIfNoRequiredFiles,
  getFileHash
};
