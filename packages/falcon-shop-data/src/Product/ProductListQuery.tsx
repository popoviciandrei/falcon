import gql from 'graphql-tag';
import { Query, Pagination, OperationInput } from '@deity/falcon-data';
import { Product, ProductListInput } from '@deity/falcon-shop-extension';

export const GET_PRODUCT_LIST = gql`
  query ProductList($input: ProductListInput) {
    productList(input: $input) {
      items {
        id
        name
        price {
          regular
          special
          minTier
        }
        thumbnail
        urlPath
      }
    }
  }
`;

export type ProductListResponse = {
  items: Pick<Product, 'id' | 'name' | 'price' | 'thumbnail' | 'urlPath'>[];
  pagination: Pagination;
};
export class ProductListQuery extends Query<ProductListResponse, OperationInput<ProductListInput>> {
  static defaultProps = {
    query: GET_PRODUCT_LIST,
    fetchPolicy: 'cache-and-network'
  };
}
