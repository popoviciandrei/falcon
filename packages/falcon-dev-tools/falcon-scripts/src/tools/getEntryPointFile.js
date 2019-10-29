const path = require('path');
const glob = require('glob');

/**
 * Returns single `[fileName].[supportedExtensions]` file
 * @param {string} directory directory to search in
 * @param {string} fileName entry point file name
 * @param {string[]} supportedExtensions extensions
 * @returns {string}
 */
module.exports.getEntryPointFile = (directory, fileName, supportedExtensions) => {
  const extensions = supportedExtensions.join('|');
  const entryPointFileName = `${fileName}[${extensions}]`;

  const files = glob.sync(`${path.join(directory, fileName)}@(${extensions})`);
  if (files.length > 1) {
    throw new Error(`Directory "${directory}" should contain single entry point '${entryPointFileName}' file!`);
  }

  if (files.length === 0) {
    console.warn(`No entry point '${entryPointFileName}' file found in directory '${directory}'. Nothing to compile.`);

    return undefined;
  }

  return files[0];
};
