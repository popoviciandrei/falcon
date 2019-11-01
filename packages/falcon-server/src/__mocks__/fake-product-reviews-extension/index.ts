export const Extension = () => ({
  resolvers: {
    Review: {
      id: () => {},
      content: () => {}
    },
    Product: {
      reviews: () => {}
    }
  }
});
