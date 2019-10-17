import Logger from '@deity/falcon-logger';
import { Cache } from '@deity/falcon-server-env';
import { Middleware } from 'koa';
import { generateTagNames } from '../graphqlUtils';

export type CacheTagEntry = {
  type: string;
  id?: string;
};

/**
 * Cache middleware for handling web-hooks to flush the cache by tags
 * @example curl -X POST http://localhost:4000/cache -H 'Content-Type: application/json' -d '[{"id": 1, "type": "Product"}]'
 * @param cache Cache component
 * @returns {Middleware} Koa middleware callback
 */
export const cacheInvalidatorMiddleware = (cache: Cache): Middleware => async ctx => {
  // List of submitted cache tag entries to invalidate
  const requestTags: Array<CacheTagEntry> = ctx.request.body;

  ctx.assert.equal(
    ctx.request.get('content-type'),
    'application/json',
    400,
    'Invalid Content-Type, must be "application/json"'
  );
  ctx.assert.equal(Array.isArray(requestTags), true, 400, 'Invalid POST data');

  const tags: string[] = requestTags
    .map(({ id, type }) => (id && type ? generateTagNames(type, id)[0] : type))
    .filter(value => value);

  Logger.getFor('cacheInvalidator').debug(`Flushing cache tags: ${tags.join(', ')}`);
  await cache.delete(tags);
  ctx.body = { success: true };
};
