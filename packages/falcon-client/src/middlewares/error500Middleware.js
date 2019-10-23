import { existsSync } from 'fs';
import { resolve as resolvePath, join as joinPath } from 'path';
import send from 'koa-send';
import Logger from '@deity/falcon-logger';
import resolve from 'resolve';
import { codes } from '@deity/falcon-errors';

/**
 * Custom 500 error middleware.
 * @returns {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const { request, response } = ctx;
    const { status = 500 } = response || {};
    const { networkError, extensions = {} } = error;
    const { code } = extensions;

    let errorToLog = networkError;
    if (!errorToLog) {
      errorToLog = error;
    }

    if (networkError || code !== codes.NOT_FOUND) {
      Logger.error(`Internal Server Error! Request: ${request.url}`);
      Logger.error(errorToLog);
    }

    let viewsDir = resolvePath(__dirname, '../', 'views');
    if (!existsSync(joinPath(viewsDir, '/errors/500.html'))) {
      viewsDir = resolvePath(resolve.sync('@deity/falcon-client/views/errors/500.html'), '../../');
    }
    ctx.status = status;

    await send(ctx, '/errors/500.html', { root: viewsDir });
  }
};
