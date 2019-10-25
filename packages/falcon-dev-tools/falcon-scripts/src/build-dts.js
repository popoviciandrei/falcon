const path = require('path');
const spawn = require('cross-spawn-promise');
const { getEntryPointFile } = require('./tools');
const { paths } = require('./tools');

function tsCompilerOptionsToCliParams(compilerOptions) {
  return Object.entries(compilerOptions).reduce(
    (result, option) => [...result, `--${option[0]}`, option[1].toString()],
    []
  );
}

const compilerOptions = {
  outDir: 'dist',
  declarationDir: 'dist',
  target: 'ESNEXT',
  module: 'ESNext',
  moduleResolution: 'Node',
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  jsx: 'react',
  alwaysStrict: true,
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  noUnusedParameters: false,
  sourceMap: true,
  skipLibCheck: true,
  declaration: true,
  emitDeclarationOnly: true,
  declarationMap: true,
  forceConsistentCasingInFileNames: true,
  pretty: true
};

module.exports.build = ({ packagePath }) => {
  console.log('building dts...');

  const entryPoint = getEntryPointFile(path.join(packagePath, 'src'), 'index', ['.ts', '.tsx', '.d.ts']);
  if (!entryPoint) {
    return;
  }

  return spawn('node', [paths.tsc, ...tsCompilerOptionsToCliParams(compilerOptions), entryPoint], {
    stdio: 'inherit'
  });
};

module.exports.watch = ({ packagePath }) => {
  console.log('building dts...');

  const entryPoint = getEntryPointFile(path.join(packagePath, 'src'), 'index', ['.ts', '.tsx', '.d.ts']);
  if (!entryPoint) {
    return;
  }

  return spawn(
    'node',
    [paths.tsc, ...tsCompilerOptionsToCliParams(compilerOptions), '--watch', '--preserveWatchOutput', entryPoint],
    {
      stdio: 'inherit'
    }
  );
};
