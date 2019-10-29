const fs = require('fs-extra');
const chalk = require('chalk');
const Logger = require('@deity/falcon-logger');
const WebpackDevServer = require('webpack-dev-server');
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');
const paths = require('../paths');
const {
  getFullIcuPath,
  removePreviousBuildAssets,
  webpackCompiler,
  webpackCompileAsync,
  logDeityGreenInfo
} = require('./tools');
const createConfig = require('./config/create');

module.exports.startDevServer = async buildConfig =>
  new Promise((resolve, reject) => {
    logDeityGreenInfo('Starting DEVELOPMENT SERVER...');

    process.env.BABEL_ENV = process.env.NODE_ENV;
    const fullIcuPath = getFullIcuPath();
    if (fullIcuPath) {
      process.env.NODE_ICU_DATA = fullIcuPath;
    }

    try {
      removePreviousBuildAssets(paths.appBuild, paths.appBuildPublic);
      const inspect = process.argv.find(x => x.match(/--inspect-brk(=|$)/) || x.match(/--inspect(=|$)/)) || undefined;

      const clientConfig = createConfig('web', { startDevServer: true, inspect, paths, buildConfig });
      const serverConfig = createConfig('node', { startDevServer: true, inspect, paths, buildConfig });

      // Compile our assets with webpack
      const clientCompiler = webpackCompiler(clientConfig);
      const serverCompiler = webpackCompiler(serverConfig);

      // Start our server webpack instance in watch mode after assets compile
      clientCompiler.plugin('done', () => {
        serverCompiler.watch({ quiet: true, stats: 'none' }, () => {});
      });

      let alreadyDone = false;
      serverCompiler.plugin('done', () => {
        if (!alreadyDone) {
          resolve();
          alreadyDone = true;
        }
      });

      // Create a new instance of Webpack-dev-server for our client assets.
      const clientDevServer = new WebpackDevServer(clientCompiler, clientConfig.devServer);
      clientDevServer.listen(buildConfig.devServerPort, error => {
        if (error) {
          Logger.error(error);
        }
      });
    } catch (error) {
      Logger.error('Compilation failed!');
      reject(error);

      throw error;
    }
  });

module.exports.build = async buildConfig => {
  const { NODE_ENV, PUBLIC_PATH } = process.env;
  process.env.BABEL_ENV = NODE_ENV;

  try {
    const previousBuildSizes = await measureFileSizesBeforeBuild(paths.appBuildPublic);
    fs.emptyDirSync(paths.appBuild);
    fs.copySync(paths.appPublic, paths.appBuildPublic, { dereference: true });

    // First compile the client. We need it to properly output assets.json
    // (asset manifest file with the correct hashes on file names BEFORE we can start the server compiler).

    const clientConfig = createConfig('web', { publicPath: PUBLIC_PATH, paths, buildConfig });
    const clientCompilation = await webpackCompileAsync(clientConfig, buildConfig.CI);

    const serverConfig = createConfig('node', { publicPath: PUBLIC_PATH, paths, buildConfig });
    // ContextReplacementPlugin https://webpack.js.org/plugins/context-replacement-plugin/
    /* const serverCompilation = */ await webpackCompileAsync(serverConfig, buildConfig.CI);

    const warnings = [...clientCompilation.warnings]; // , ...serverCompilation.warnings]

    if (warnings.length) {
      Logger.warn(chalk.yellow('\nCompiled with warnings.\n'));
      Logger.warn(warnings.join('\n\n'));
      Logger.info();
    } else {
      Logger.info(chalk.green('\nCompiled successfully.\n'));
    }

    Logger.info('File sizes after gzip:\n');
    const { stats } = clientCompilation;
    printFileSizesAfterBuild(stats, previousBuildSizes, paths.appBuild);
    Logger.info();
  } catch (error) {
    Logger.error(chalk.red('\nFailed to compile.\n'));
    Logger.error(error);
    Logger.info();

    process.exit(1);
  }
};

module.exports.size = async buildConfig => {
  const { NODE_ENV, PUBLIC_PATH } = process.env;
  process.env.BABEL_ENV = NODE_ENV;

  try {
    fs.emptyDirSync(paths.appBuild);
    fs.copySync(paths.appPublic, paths.appBuildPublic, { dereference: true });

    Logger.info('Compiling client...');
    const clientConfig = createConfig('web', { publicPath: PUBLIC_PATH, analyze: true, paths, buildConfig });
    const { warnings } = await webpackCompileAsync(clientConfig);

    if (warnings.length) {
      Logger.warn(chalk.yellow('\nCompiled client with warnings.\n'));
      Logger.warn(warnings.join('\n\n'));
      Logger.info();
    } else {
      Logger.info(chalk.green('\nCompiled client successfully.\n'));
    }

    Logger.info();
  } catch (error) {
    Logger.error(`${chalk.red('\nFailed to compile client.\n')}`);
    Logger.error(error);
    Logger.info();

    process.exit(1);
  }
};
