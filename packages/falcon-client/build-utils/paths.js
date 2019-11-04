const path = require('path');
const fs = require('fs');

/**
 * @param {string} packageName npm package name
 * @returns {string} absolute path
 */
const resolvePackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`));
const ownDirectory = resolvePackageDir('@deity/falcon-client');
const appDirectory = fs.realpathSync(process.cwd());

/**
 * @param {string} ownRelativePath path relative to own directory (@deity/falcon-client)
 * @returns {string} absolute path
 */
const resolveOwn = ownRelativePath => path.resolve(ownDirectory, ownRelativePath);

/**
 * @param {string} appRelativePath path relative to app directory (process.cwd())
 * @returns {string} absolute path
 */
const resolveApp = appRelativePath => path.resolve(appDirectory, appRelativePath);

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const nodePath = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

module.exports = {
  resolveApp,
  resolveOwn,
  resolvePackageDir,
  nodePath,

  appPath: resolveApp('.'),
  appIndexJs: resolveApp('index.js'),
  appSwJs: resolveApp('sw.js'),
  appBootstrapJs: resolveApp('bootstrap.js'),
  appBuildConfigJs: resolveApp('falcon-client.build.config.js'),
  appSrc: resolveApp('src'),
  appWebmanifest: resolveApp('src/manifest.webmanifest'),
  appViews: resolveApp('views'),

  appPackageJson: resolveApp('package.json'),
  appPublic: resolveApp('public'),
  appBuild: resolveApp('build'),
  appWebpackAssets: resolveApp('build/assets.json'),
  appBuildPublic: resolveApp('build/public'),
  appBuildViews: resolveApp('build/views'),

  testsSetup: resolveApp('src/setupTests.js'),
  appBabelRc: resolveApp('.babelrc'),
  appEslintRc: resolveApp('.eslintrc'),
  appNodeModules: resolveApp('node_modules'),

  ownPath: resolveOwn('.'),
  ownSwJs: resolveOwn('sw.js'),
  ownSrc: resolveOwn('src'),
  ownServerIndexJs: resolveOwn('src/index'),
  ownClientIndexJs: resolveOwn('src/client'),
  ownWebmanifest: resolveOwn('src/manifest.webmanifest'),
  ownViews: resolveOwn('views'),
  ownNodeModules: resolveOwn('node_modules')
};
