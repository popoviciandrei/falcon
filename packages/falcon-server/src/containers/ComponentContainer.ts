/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { EventEmitter2 } from 'eventemitter2';
import { ComponentEntryMap } from '../types';
import { BaseContainer } from './BaseContainer';

export type ComponentMap = Record<string, any>;

export interface IComponent<TComponentInstance = any, TConfig = any> {
  new (config: TConfig): TComponentInstance;
  (config: TConfig): Promise<TComponentInstance>;
}

export class ComponentContainer extends BaseContainer {
  public components: ComponentMap = {};

  /**
   * Registers components based on the provided configuration
   * @param components Key-value list of components
   */
  async registerComponents(components: ComponentEntryMap = {}): Promise<void> {
    for (const componentKey in components) {
      if (Object.prototype.hasOwnProperty.call(components, componentKey)) {
        const component = components[componentKey];

        const { package: pkg, config = {} } = component;
        const ComponentClass = this.importModule<IComponent>(pkg);
        if (!ComponentClass) {
          return;
        }
        this.components[componentKey] = ComponentClass.prototype
          ? new ComponentClass(config)
          : await ComponentClass(config);

        this.logger.debug(`"${componentKey}" component instantiated`);
      }
    }
  }
}
