import gql from 'graphql-tag';
import { Cart, CartItem } from '@deity/falcon-shop-extension';
import { Query } from '@deity/falcon-data';

export const GET_MINI_CART = gql`
  query MiniCart {
    cart {
      itemsQty
      quoteCurrency
      items {
        itemId
        sku
        qty
        name
        price
        thumbnailUrl
      }
    }
  }
`;

export type MiniCartResponse = {
  cart: Pick<Cart, 'itemsQty' | 'quoteCurrency'> & {
    items: Pick<CartItem, 'itemId' | 'sku' | 'qty' | 'name' | 'price' | 'thumbnailUrl'>[];
  };
};

export class MiniCartQuery extends Query<MiniCartResponse> {
  static defaultProps = {
    query: GET_MINI_CART
  };
}
