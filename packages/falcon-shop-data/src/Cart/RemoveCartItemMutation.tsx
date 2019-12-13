import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { RemoveCartItemInput, RemoveCartItemPayload } from '@deity/falcon-shop-extension';
import { GET_CART } from './CartQuery';

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      itemId
    }
  }
`;

export type RemoveCartItemResponse = {
  removeCartItem: RemoveCartItemPayload;
};

export class RemoveCartItemMutation extends Mutation<RemoveCartItemResponse, OperationInput<RemoveCartItemInput>> {
  static defaultProps = {
    mutation: REMOVE_CART_ITEM,
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
    update: (
      store: any,
      {
        data: {
          removeCartItem: { itemId }
        }
      }: any
    ) => {
      const data = store.readQuery({
        query: GET_CART
      });

      data.cart.items = data.cart.items.filter((item: any) => item.itemId !== itemId);
      data.cart.itemsQty = data.cart.items.length;

      store.writeQuery({
        query: GET_CART,
        data
      });
    }
  };
}
