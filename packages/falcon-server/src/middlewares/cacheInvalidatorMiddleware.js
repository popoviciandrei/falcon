const Logger = require('@deity/falcon-logger');
const { generateTagNames } = require('../graphqlUtils');

/**
 * @typedef {import('@deity/falcon-server-env').Cache} Cache
 * @typedef {import('koa').Middleware} Middleware
 *
 * @typedef {object} CacheTagEntry
 * @property {string} type Entity Type
 * @property {string} id Entity ID
 */

/**
 * Cache middleware for handling web-hooks to flush the cache by tags
 * @example curl -X POST http://localhost:4000/cache -H 'Content-Type: application/json' -d '[{"id": 1, "type": "Product"}]'
 * @param {Cache} cache Cache component
 * @returns {Middleware} Koa middleware callback
 */
const cacheInvalidatorMiddleware = cache => async ctx => {
  /** @type {Array<CacheTagEntry>} List of posted cache tag entries to invalidate */
  const requestTags = ctx.request.body;

  ctx.assert.equal(
    ctx.request.get('content-type'),
    'application/json',
    400,
    'Invalid Content-Type, must be "application/json"'
  );
  ctx.assert.equal(Array.isArray(requestTags), true, 400, 'Invalid POST data');

  /** @type {Array<string>} List of cache tags */
  const tags = requestTags
    .map(({ id, type }) => (id && type ? generateTagNames(type, id) : type))
    .filter(value => value);

  Logger.getFor('cache').debug(`Flushing cache tags: ${tags.join(', ')}`);
  await cache.delete(tags);
  ctx.body = 'ok';
};

module.exports = cacheInvalidatorMiddleware;
