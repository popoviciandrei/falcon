import gql from 'graphql-tag';
import { Query } from '../Query';
import { ProductData } from '../Product/ProductQuery';

export const GET_PRODUCT_LIST = gql`
  query Products {
    products {
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

export type Products = {
  items: ProductData[];
};

export class ProductListQuery extends Query<Products> {
  static defaultProps = {
    query: GET_PRODUCT_LIST,
    fetchPolicy: 'cache-and-network'
  };
}
