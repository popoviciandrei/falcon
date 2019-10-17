const paths = require('./paths');
const { getEntryPointFile } = require('./getEntryPointFile');

const config = {
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  babelConfigPath: require.resolve('../babel/babel.config')
};

module.exports = {
  config,
  getEntryPointFile,
  paths
};
