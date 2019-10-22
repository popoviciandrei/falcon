import { ChunkExtractor } from '@loadable/server';

/**
 * Assets middleware
 * @param {{webpackAssets: Object}} params webpack assets
 * @returns {import('koa').Middleware} Koa middleware
 */
export default ({ webpackAssets }) => {
  const chunkExtractor = new ChunkExtractor({
    stats: webpackAssets,
    entrypoints: ['client'],
    outputPath: process.env.OUTPUT_DIR
  });

  return async (ctx, next) => {
    const { assets, publicPath } = webpackAssets;
    const webmanifest = assets.find(x => x.name.endsWith('webmanifest'));

    ctx.state.assets = {
      webpackAssets,
      webmanifest: webmanifest ? `${publicPath}${webmanifest.name}` : undefined
    };
    ctx.state.chunkExtractor = chunkExtractor;

    return next();
  };
};
