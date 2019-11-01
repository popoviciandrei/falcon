export const Extension = () => ({
  resolvers: {
    Query: {
      productList: () => {}
    },
    Product: {
      id: () => {},
      name: () => {}
    }
  }
});
