#!/usr/bin/env node

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
});
process.on('uncaughtException', ex => {
  console.log('Uncaught Exception: ', ex);
});
process.noDeprecation = true; // turns off that loadQuery clutter.

const Logger = require('@deity/falcon-logger');
const { build, size, startDevServer, test } = require('../build-utils');

(async () => {
  const script = process.argv[2];
  const args = process.argv.slice(3) || [];

  try {
    switch (script) {
      case 'start': {
        await startDevServer(args);
        break;
      }

      case 'build': {
        await build(args);
        break;
      }
      case 'size': {
        await size(args);
        break;
      }

      case 'test': {
        test();
        break;
      }

      default:
        Logger.warn(`Unknown script "${script}".`);
        Logger.warn('Perhaps you need to update @deity/falcon-client?');
        process.exit();

        break;
    }
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
})();
