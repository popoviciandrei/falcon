const { resolve } = require('path');
const Logger = require('@deity/falcon-logger');

const tryRequire = moduleName => {
  try {
    return {
      module: require(moduleName), // eslint-disable-line import/no-dynamic-require,
      exists: true,
      error: undefined
    };
  } catch (error) {
    const { code, message } = error;

    // Note: error.message in Node 12 contains "Require stack" now.
    return {
      module: undefined,
      exists: code !== 'MODULE_NOT_FOUND' || !message.startsWith(`Cannot find module '${moduleName}'`),
      error
    };
  }
};

module.exports = class BaseContainer {
  /**
   * Base Container constructor
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.logger = Logger.getFor(this.constructor.name);
  }

  /**
   * Imports the specified module (via "require()") by checking installed NPM package
   * (by package name) and your local project folder.
   * @param {string} pathOrPackage Local path or package name of the module
   * @returns {any} Imported module
   */
  importModule(pathOrPackage) {
    const requiredPackage = tryRequire(pathOrPackage);
    if (requiredPackage.exists) {
      const { module, error } = requiredPackage;
      if (error) {
        this.logger.error(`"${pathOrPackage}" cannot be loaded. - ${error.message}\n${error.stack} `);

        return undefined;
      }

      this.logger.debug(`"${pathOrPackage}" loaded as a package`);

      return module;
    }

    const modulePath = resolve(process.cwd(), pathOrPackage);
    const requiredModule = tryRequire(modulePath);
    if (requiredModule.exists) {
      const { module, error } = requiredModule;
      if (error) {
        this.logger.error(`"${pathOrPackage}" cannot be loaded. - ${error.message}\n${error.stack}`);

        return undefined;
      }

      this.logger.debug(`"${pathOrPackage}" loaded from '${modulePath}'`);

      return module;
    }

    this.logger.error(
      `Cannot find package '${pathOrPackage}' or module '${modulePath}'. Please check your config ("package" key)`
    );

    return undefined;
  }
};
