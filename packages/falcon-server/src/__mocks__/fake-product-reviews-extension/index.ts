export default () => ({
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
