export default () => ({
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
