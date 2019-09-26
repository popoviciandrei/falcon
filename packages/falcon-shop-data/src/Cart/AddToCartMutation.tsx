import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { AddToCartInput, CartItemPayload } from '@deity/falcon-shop-extension';

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      itemId
      sku
      qty
      name
      price
      productType
    }
  }
`;

export type AddToCartResponse = {
  addToCart: CartItemPayload;
};

export class AddToCartMutation extends Mutation<AddToCartResponse, OperationInput<AddToCartInput>> {
  static defaultProps = {
    mutation: ADD_TO_CART,
    refetchQueries: ['MiniCart', 'Cart']
  };
}
