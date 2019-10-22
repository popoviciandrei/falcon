const path = require('path');
const glob = require('glob');
const ts = require('typescript');

class FormatHost {
  getCurrentDirectory() {
    return ts.sys.getCurrentDirectory();
  }

  getCanonicalFileName(fileName) {
    return path.normalize(fileName);
  }

  getNewLine() {
    return ts.sys.newLine;
  }
}

function tsc(fileNames, options) {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();
  let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  allDiagnostics = ts.sortAndDeduplicateDiagnostics(allDiagnostics);

  if (allDiagnostics.some(x => x.category === 1)) {
    console.error(ts.formatDiagnosticsWithColorAndContext(allDiagnostics, new FormatHost()));

    throw new Error();
  }

  console.log(ts.formatDiagnosticsWithColorAndContext(allDiagnostics, new FormatHost()));
}

module.exports = ({ packagePath }) => {
  console.log('building d.ts...');

  const files = glob.sync(`${path.join(packagePath, 'src')}/*(*.ts|*.tsx)`);

  tsc(files, {
    outDir: 'dist',
    declarationDir: 'dist',
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    jsx: ts.JsxEmit.React,
    alwaysStrict: true,
    noFallthroughCasesInSwitch: true,
    noImplicitReturns: true,
    noUnusedParameters: true,
    sourceMap: true,
    skipLibCheck: true,
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: true,
    forceConsistentCasingInFileNames: true,
    pretty: true
  });
};
