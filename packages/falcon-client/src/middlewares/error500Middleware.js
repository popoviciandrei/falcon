import send from 'koa-send';
import Logger from '@deity/falcon-logger';
import { codes } from '@deity/falcon-errors';

/**
 * Custom 500 error middleware.
 * @returns {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const { request, response = {} } = ctx;
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

    ctx.status = response.status || 500;
    await send(ctx, 'views/errors/500.html', { root: __dirname });
  }
};
