const path = require('path');

/**
 * @typedef {object} FalconEnv
 * @property {string} NODE_ENV
 * @property {string} BABEL_ENV
 * @property {string | undefined} DEV_SERVER_PORT
 * @property {'client' | 'server'} BUILD_TARGET
 * @property {string | undefined} PUBLIC_PATH
 * @property {string} WEBPACK_ASSETS
 * @property {string} OUTPUT_DIR
 * @property {string} PUBLIC_DIR
 * @property {string} SW_DIR
 */

/**
 * @param {'web'|'node'} target
 * @param {'development'|'production'| 'test'} env
 * @param {string} publicPath
 * @param {import('../../paths')} paths
 * @param {boolean} startDevServer
 * @param {string} devServerPort
 * @param {string[]} envToBuildIn
 * @returns {FalconEnv}
 */
function buildClientEnv(
  target,
  env,
  publicPath,
  paths,
  startDevServer = false,
  devServerPort = undefined,
  envToBuildIn = []
) {
  const envVariablesToBuildIn = Object.keys(process.env)
    .filter(x => envToBuildIn.find(e => e === x))
    .reduce((result, x) => {
      result[x] = process.env[x];
      return result;
    }, {});

  const falconEnv = {
    NODE_ENV: env,
    BABEL_ENV: env,
    ...(env === 'development' ? { DEV_SERVER_PORT: devServerPort } : {}),
    BUILD_TARGET: target === 'web' ? 'client' : 'server',
    PUBLIC_PATH: env === 'production' ? publicPath : undefined,
    WEBPACK_ASSETS: paths.appWebpackAssets,
    OUTPUT_DIR: path.relative(paths.appPath, paths.appBuildPublic),
    PUBLIC_DIR: path.relative(paths.appPath, !startDevServer ? paths.appBuildPublic : paths.appPublic),
    SW_DIR: path.relative(paths.appPath, env === 'production' ? paths.appBuildPublic : paths.appBuild)
  };

  return {
    ...envVariablesToBuildIn,
    ...falconEnv
  };
}

/**
 * @param {object} data env variables name/value map
 * @returns {object}
 */
function serializeEnvVariables(data) {
  return Object.keys(data).reduce((result, x) => {
    result[`process.env.${x}`] = JSON.stringify(data[x]);
    return result;
  }, {});
}

module.exports = {
  buildClientEnv,
  serializeEnvVariables
};
