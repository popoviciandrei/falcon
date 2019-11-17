/* eslint-disable no-restricted-syntax, no-await-in-loop, no-underscore-dangle */
import { Cache, EndpointEntry, EndpointConstructor } from '@deity/falcon-server-env';
import { EventEmitter2 } from 'eventemitter2';
import { EndpointEntryMap } from '../types';
import { BaseContainer } from './BaseContainer';

export class EndpointContainer extends BaseContainer {
  public entries: Array<EndpointEntry> = [];

  constructor(eventEmitter: EventEmitter2, protected cache: Cache) {
    super(eventEmitter);
  }

  /**
   * Instantiates endpoints based on the passed configuration and registers event handlers for them
   * @param {EndpointEntryMap} config Configuration object of endpoints
   */
  async registerEndpoints(config: EndpointEntryMap) {
    for (const endpointKey in config) {
      if (Object.prototype.hasOwnProperty.call(config, endpointKey)) {
        const endpointManagerConfig = config[endpointKey];

        const EndpointManagerClass = this.importModule<EndpointConstructor>(endpointManagerConfig.package);
        if (!EndpointManagerClass) {
          this.logger.warn(`Could not load ${endpointManagerConfig.package}`);
          return;
        }
        const endpointManager = new EndpointManagerClass({
          cache: this.cache,
          config: endpointManagerConfig.config || {},
          name: endpointKey,
          eventEmitter: this.eventEmitter
        });

        this.logger.debug(`"${endpointManager.name}" Endpoint Manager has been instantiated`);
        this.entries.push(...endpointManager.getEntries());
      }
    }
  }
}
