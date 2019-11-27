import { EventEmitter2 } from 'eventemitter2';
import fetch from 'node-fetch';
import Logger from '@deity/falcon-logger';
import { IConfigurableConstructorParams, EndpointEntry, UrlConfig } from '../types';
import { formatUrl } from '../helpers/url';
import { Cache } from '..';

export interface EndpointConstructorParams extends IConfigurableConstructorParams<UrlConfig> {
  cache: Cache;
  entries?: string[];
}

export interface EndpointConstructor<T extends EndpointManager = EndpointManager> {
  new (params: EndpointConstructorParams): T;
}

export abstract class EndpointManager {
  public config: UrlConfig;

  public name: string;

  public baseUrl: string;

  public entries: string[];

  protected fetch = fetch;

  protected eventEmitter: EventEmitter2;

  protected cache: Cache;

  protected logger: typeof Logger;

  constructor(params: EndpointConstructorParams) {
    this.config = params.config || {};
    this.name = params.name || this.constructor.name;
    this.eventEmitter = params.eventEmitter;
    this.cache = params.cache;
    this.entries = params.entries || [];
    this.baseUrl = formatUrl(this.config);
    this.logger = Logger.getFor(`${this.name}-endpointManager`);
  }

  /**
   * @returns {Array<EndpointEntry>} List of supported endpoints
   */
  getEntries(): Array<EndpointEntry> {
    return [];
  }
}
