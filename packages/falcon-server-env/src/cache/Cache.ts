/* eslint-disable no-useless-constructor, no-dupe-class-members, no-empty-function */
import { KeyValueCache } from 'apollo-server-caching';

export type SetCacheOptions = {
  ttl?: number;
  tags?: string[];
};

export type ValueOptions = {
  tags?: TagMap;
};

export type TagMap = {
  [key: string]: string;
};

export type GetCacheFetchResult =
  | any
  | {
      value: any;
      options?: SetCacheOptions;
    };

export type GetCacheOptions = {
  fetchData: () => Promise<GetCacheFetchResult>;
  options?: SetCacheOptions;
};

const DEFAULT_TAG_TTL: number = 60 * 60; // 1 hour

/**
 * Cache-wrapper with extended methods
 */
export class Cache<V = any> implements KeyValueCache<V> {
  protected activeGetRequests: Map<string, Promise<V>> = new Map();

  constructor(public provider: KeyValueCache<string>, protected tagTtl: number = DEFAULT_TAG_TTL) {}

  async get(key: string): Promise<V>;

  async get(key: string, setOptions: GetCacheOptions): Promise<V>;

  /**
   * Returns cached value for the provided key and setOptions object
   * @param {string} key Cache key
   * @param {GetCacheOptions} setOptions Object with params to fetch the data to be cached
   * @returns {Promise<V>} Cached value
   */
  async get(key: string, setOptions?: GetCacheOptions): Promise<V> {
    if (this.activeGetRequests.has(key)) {
      return this.activeGetRequests.get(key) as Promise<V>;
    }

    this.activeGetRequests.set(key, this.createGetRequest(key, setOptions));
    const result = await this.activeGetRequests.get(key);
    this.activeGetRequests.delete(key);

    return result as V;
  }

  async set(key: string, value: V): Promise<void>;

  async set(key: string, value: V, options: SetCacheOptions): Promise<void>;

  async set(key: string, value: V, options?: SetCacheOptions): Promise<void> {
    let cachedValue: V | GetCacheFetchResult = value;
    const { tags } = options || ({} as SetCacheOptions);
    if (tags) {
      const tagValues = await this.getTagsByNames(tags, true);
      cachedValue = {
        value: cachedValue,
        options: {
          tags: tagValues
        }
      };
    }

    if (Array.isArray(cachedValue) || typeof cachedValue === 'object') {
      // For non-scalar values - JSON.stringify
      cachedValue = JSON.stringify(cachedValue);
    }

    return this.provider.set(key, cachedValue, options);
  }

  async delete(key: string): Promise<boolean>;

  async delete(keys: string[]): Promise<void>;

  /**
   * Cache key or array of cache keys to be removed from the cache.
   * Can be used to invalidate cache by tags
   * @param {string|string[]} key One or more cache keys to be removed
   * @returns {Promise<boolean|void>} Result
   */
  async delete(key: string | string[]): Promise<boolean | void> {
    if (Array.isArray(key)) {
      await Promise.all(key.map(kKey => this.delete(kKey)));
      return;
    }
    return this.provider.delete(key);
  }

  /**
   * Check provided key-value tag object with the tags from the cache backend
   * @param {TagMap} tagMap Key-value object (tags)
   * @returns {Promise<boolean>} Result
   */
  private async isTagMapValid(tagMap: TagMap): Promise<boolean> {
    const tagNames: string[] = Object.keys(tagMap);
    if (!tagNames.length) {
      // No tags available - we have nothing to validate against to
      return true;
    }
    const storedTags = await this.getTagsByNames(tagNames);

    // Simple key count check
    if (tagNames.length !== Object.keys(storedTags).length) {
      return false;
    }

    // Pair checking
    return !tagNames.some(name => tagMap[name] !== storedTags[name]);
  }

  /**
   * Load tag values from the cache backend
   * @param {string[]} names List of tag names to be loaded from the Cache Backend
   * @param {boolean} [createIfMissing=false] Flag whether to create new values for missing tags
   * @returns {Promise<TagMap>} Key-value object
   */
  private async getTagsByNames(names: string[], createIfMissing: boolean = false): Promise<TagMap> {
    const tagValues: TagMap = {};
    await Promise.all(
      names.map(async tag => {
        let tagValue: any = await this.get(tag);
        if (typeof tagValue === 'undefined' && createIfMissing) {
          // For "createIfMissing" flag - generate new tag value and save it to the cache
          tagValue = this.generateTagValue();
          await this.set(tag, tagValue, { ttl: this.tagTtl });
        }

        if (tagValue) {
          tagValues[tag] = tagValue;
        }
      })
    );

    return tagValues;
  }

  /**
   * Check if the provided values contains cache "options" object
   * @param {any} data Data to be checked
   * @returns {boolean} Result of check
   */
  private isValueWithOptions(data: any): boolean {
    return typeof data === 'object' && 'value' in data && 'options' in data;
  }

  private async createGetRequest(key: string, setOptions?: GetCacheOptions): Promise<V> {
    let value: GetCacheFetchResult = await this.provider.get(key);
    try {
      value = JSON.parse(value);
    } catch {
      // Keep `value` with the original value
    }

    // Validating by cache tags
    if (this.isValueWithOptions(value)) {
      const { tags: tagMap = {} } = value.options as ValueOptions;
      if (await this.isTagMapValid(tagMap as TagMap)) {
        ({ value } = value);
      } else {
        // If tags are invalid - set value as "not found"
        value = undefined;
        await this.delete(key);
      }
    }

    if (typeof value === 'undefined' && typeof setOptions === 'object') {
      const { fetchData } = setOptions;
      let { options } = setOptions;
      const cacheResult: GetCacheFetchResult = await fetchData();
      if (typeof cacheResult !== 'undefined') {
        if (this.isValueWithOptions(cacheResult)) {
          ({ value } = cacheResult);
          const { options: cacheResultOptions = {} } = cacheResult;
          // Merging cache options from the "fetchData" result and passed method argument
          options = Object.assign({}, options, cacheResultOptions);
        } else {
          value = cacheResult;
        }

        if (typeof value !== 'undefined') {
          await this.set(key, value, options as SetCacheOptions);
        }
      }
    }

    return value;
  }

  /**
   * Generating a short and safe enough tag value (second + ms = will ensure a unique value for the same tag name)
   * @returns {number} Tag value
   */
  private generateTagValue(): number {
    return parseInt(
      Date.now()
        .toString()
        .substr(6),
      10
    );
  }
}
