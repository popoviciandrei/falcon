const paths = require('./../paths');
const { buildClientEnv } = require('./../webpack/config/env');

const mockEnvVariables = () => {
  const envMock = buildClientEnv('web', 'test', '/', paths);
  Object.keys(envMock).forEach(x => {
    process.env[x] = process.env[x] || envMock[x];
  });
};

const run = () => {
  process.env.FORCE_COLOR = 0;
  mockEnvVariables();

  const createConfig = require('./config/create');
  const config = createConfig(paths);

  const argv = process.argv.slice(2);
  // Watch unless on CI or in coverage mode
  if (!process.env.CI && argv.indexOf('--coverage') < 0) {
    argv.push('--watch');
  }
  argv.push('--config', JSON.stringify(config));

  require('jest').run(argv);
};

module.exports = {
  run,
  mockEnvVariables
};
