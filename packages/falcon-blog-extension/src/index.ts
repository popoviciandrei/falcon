export * from './types';

/**
 * Blog Extension
 */
export default () => ({
  resolvers: {
    BackendConfig: {
      // Returning an empty object to make BlogConfig resolvers work
      blog: () => ({})
    }
  }
});
