require('./build-utils/jest').mockEnvVariables();

// eslint-disable-next-line import/no-extraneous-dependencies
const Adapter = require('enzyme-adapter-react-16');
// eslint-disable-next-line import/no-extraneous-dependencies
const { configure: configureEnzyme } = require('enzyme');

configureEnzyme({ adapter: new Adapter() });
