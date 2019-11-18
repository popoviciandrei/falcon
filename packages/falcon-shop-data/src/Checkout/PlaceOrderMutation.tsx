import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { PlaceOrderResult, PlaceOrderInput } from '@deity/falcon-shop-extension';

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput) {
    placeOrder(input: $input) {
      __typename
      ... on PlaceOrderSuccessfulResult {
        orderId
        orderRealId
      }
      ... on PlaceOrder3dSecureResult {
        url
        method
        fields {
          name
          value
        }
      }
    }
  }
`;

export type PlaceOrderResponse = {
  placeOrder: PlaceOrderResult;
};

export class PlaceOrderMutation extends Mutation<PlaceOrderResponse, OperationInput<PlaceOrderInput>> {
  static defaultProps = {
    mutation: PLACE_ORDER,
    refetchQueries: ['Cart', 'OrderList']
  };
}

export const usePlaceOrderMutation = (
  options?: MutationHookOptions<PlaceOrderResponse, OperationInput<PlaceOrderInput>>
) =>
  useMutation<PlaceOrderResponse, OperationInput<PlaceOrderInput>>(PLACE_ORDER, {
    refetchQueries: ['Cart', 'OrderList'],
    ...(options || {})
  });
