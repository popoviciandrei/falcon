const spawn = require('cross-spawn-promise');
const { config } = require('./tools');

module.exports.build = async () => {
  console.log('building esm...');

  return spawn(
    'babel',
    [
      'src',
      '-d',
      'dist',
      '-x',
      config.fileExtensions.join(','),
      '--ignore',
      `**/__mocks__,${config.fileExtensions.map(x => `**/*.test${x}`).join(',')},src/bin/**`,
      '-s',
      '--config-file',
      config.babelConfigPath,
      '--source-map',
      'inline'
    ],
    {
      stdio: 'inherit'
    }
  );
};

module.exports.watch = () => {
  console.log('building esm...');

  return spawn(
    `babel`,
    [
      'src',
      '-d',
      'dist',
      '-x',
      config.fileExtensions.join(','),
      '--ignore',
      `**/__mocks__,${config.fileExtensions.map(x => `**/*.test${x}`).join(',')},src/bin/**`,
      '-s',
      '--config-file',
      config.babelConfigPath,
      '--source-map',
      'inline',
      '--watch'
    ],
    {
      stdio: 'inherit'
    }
  );
};
