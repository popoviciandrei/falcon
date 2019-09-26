import gql from 'graphql-tag';
import { Cart, CartItem, CartItemOption } from '@deity/falcon-shop-extension';
import { Query } from '@deity/falcon-data';

export const GET_CART = gql`
  query Cart {
    cart {
      itemsQty
      quoteCurrency
      couponCode
      totals {
        code
        title
        value
      }
      items {
        itemId
        sku
        qty
        name
        price
        rowTotalInclTax
        thumbnailUrl
        itemOptions {
          label
          value
        }
      }
    }
  }
`;

export type CartResponse = {
  cart: Pick<Cart, 'itemsQty' | 'itemsCount' | 'quoteCurrency' | 'couponCode' | 'totals'> & {
    items: Pick<CartItem, 'itemId' | 'sku' | 'qty' | 'name' | 'price' | 'rowTotalInclTax' | 'thumbnailUrl'> & {
      itemOptions: Pick<CartItemOption, 'label' | 'value'>[];
    };
  };
};

export class CartQuery extends Query<CartResponse> {
  static defaultProps = {
    query: GET_CART
  };
}
