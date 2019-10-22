const path = require('path');
const fs = require('fs');

/**
 * @param {string} packageName npm package name
 * @returns {string} absolute path
 */
const resolvePackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`));
const ownDirectory = resolvePackageDir('@deity/falcon-scripts');
const directory = fs.realpathSync(process.cwd());

/**
 * @param {string} ownRelativePath path relative to own directory (@deity/falcon-client)
 * @returns {string} absolute path
 */
const resolveOwn = ownRelativePath => path.resolve(ownDirectory, ownRelativePath);

/**
 * @param {string} appRelativePath path relative to app directory (process.cwd())
 * @returns {string} absolute path
 */
const resolvePkg = appRelativePath => path.resolve(directory, appRelativePath);

module.exports = {
  resolvePkg,
  resolvePackageDir,
  resolveOwn,

  pkgPath: resolvePkg('.'),
  pkgSrc: resolvePkg('src'),
  pkgDist: resolvePkg('dist'),
  pkgBinSrc: resolvePkg('src/bin'),
  pkgBinDist: resolvePkg('dist/bin'),

  pkgPackageJson: resolvePkg('package.json'),
  pkgNodeModules: resolvePkg('node_modules'),

  ownPath: resolveOwn('.')
};
