/**
 * Blog Extension
 */
const BlogExtension = () => ({
  resolvers: {
    BackendConfig: {
      // Returning an empty object to make BlogConfig resolvers work
      blog: () => ({})
    }
  }
});

export * from './types';
export { BlogExtension as Extension };
