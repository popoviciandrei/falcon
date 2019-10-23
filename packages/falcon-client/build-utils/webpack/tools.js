const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const Logger = require('@deity/falcon-logger');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const paths = require('./../paths');

const colors = {
  deityGreen: '#a9cf38'
};

function logDeityGreenInfo(x) {
  Logger.info(chalk.hex(colors.deityGreen)(x));
}

function webpackCompiler(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (error) {
    Logger.error(chalk.red('Failed to compile.'));
    Logger.error(error);

    process.exit(1);
  }

  return compiler;
}

function webpackCompileAsync(config, emitWarningsAsErrors = false) {
  return new Promise((resolve, reject) => {
    const compiler = webpackCompiler(config);
    compiler.run((error, stats) => {
      if (error) {
        return reject(error);
      }

      const { errors, warnings } = formatWebpackMessages(stats.toJson({}, true));
      if (errors.length) {
        return reject(new Error(errors.join('\n\n')));
      }
      if (emitWarningsAsErrors && warnings.length) {
        Logger.warn(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\nMost CI servers set it automatically.\n'
          )
        );
        return reject(new Error(warnings.join('\n\n')));
      }

      return resolve({
        stats,
        warnings
      });
    });
  });
}

function removePreviousBuildAssets(appBuild, appBuildPublic) {
  if (fs.existsSync(appBuild)) {
    const productionPublicDirName = path.relative(appBuild, appBuildPublic);
    fs.readdirSync(appBuild)
      .filter(x => x !== productionPublicDirName)
      .forEach(file => fs.removeSync(path.join(appBuild, file)));
  }
}

function getFullIcuPath() {
  if (process.env.NODE_ICU_DATA !== undefined) {
    return process.env.NODE_ICU_DATA;
  }

  return paths.resolvePackageDir('full-icu');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MB`;

  return `${(bytes / 1073741824).toFixed(3)} GB`;
}

module.exports = {
  colors,
  logDeityGreenInfo,
  getFullIcuPath,
  removePreviousBuildAssets,
  webpackCompiler,
  webpackCompileAsync,
  formatBytes
};
