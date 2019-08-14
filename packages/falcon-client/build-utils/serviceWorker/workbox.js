const path = require('path');
const workbox = require('workbox-build');
const Logger = require('@deity/falcon-logger');
const { formatBytes } = require('../webpack/tools');
const { getFileHash } = require('../tools');
const paths = require('../paths');

/**
 * Generates Workbox precache manifest
 * @returns {object[]} entries
 */
async function getManifestEntries() {
  try {
    const appShellHash = `${await getFileHash(paths.appWebpackAssets)}${await getFileHash(
      path.join(paths.appBuild, 'server.js')
    )}`;

    const configuration = {
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
      globDirectory: '.',
      globPatterns: ['build/public/**/*.{js,json,html,css,ico,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
      modifyURLPrefix: { 'build/public': '' },
      templatedURLs: { '/app-shell': appShellHash },
      dontCacheBustURLsMatching: /\/static\/.*/
    };

    const { manifestEntries, size, warnings } = await workbox.getManifest(configuration);

    if (warnings.length) {
      Logger.warn(warnings.join('\n'));
    }

    Logger.info(`Precaching ${manifestEntries.length} files, in total ${formatBytes(size)}.`);

    return manifestEntries;
  } catch (error) {
    Logger.error('Precache entries generation failed!');

    throw error;
  }
}

module.exports = {
  getManifestEntries
};
