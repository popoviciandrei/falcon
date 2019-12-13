import { Events, generateTagNames } from '@deity/falcon-server-env';
import { WebServerMiddleware } from '../types';

export type CacheTagEntry = {
  type: string;
  id?: string;
};

/**
 * Cache middleware for handling web-hooks to flush the cache by tags
 * @example curl -X POST http://localhost:4000/cache -H 'Content-Type: application/json' -d '[{"id": 1, "type": "Product"}]'
 * @returns {WebServerMiddleware} Koa middleware callback
 */
export const cacheInvalidatorMiddleware = (): WebServerMiddleware => async ctx => {
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

  await ctx.eventEmitter.emitAsync(Events.CACHE_TAG_INVALIDATE, tags);
  ctx.body = { success: true };
};
