/* eslint-disable no-restricted-syntax, no-await-in-loop */
const BaseContainer = require('./BaseContainer');

module.exports = class ComponentContainer extends BaseContainer {
  constructor(eventEmitter) {
    super(eventEmitter);
    /** @type {Object<string, mixed>} Object of components */
    this.components = {};
  }

  /**
   * Registers components based on the provided configuration
   * @param {Object<string, Object>} components Key-value list of components
   * @returns {undefined}
   */
  async registerComponents(components = {}) {
    for (const componentKey in components) {
      if (Object.prototype.hasOwnProperty.call(components, componentKey)) {
        const component = components[componentKey];

        const { package: pkg, config = {} } = component;
        const ComponentClass = this.importModule(pkg);
        if (!ComponentClass) {
          return;
        }
        this.components[componentKey] = ComponentClass.prototype
          ? new ComponentClass(config)
          : await ComponentClass(config);
      }
    }
  }
};
