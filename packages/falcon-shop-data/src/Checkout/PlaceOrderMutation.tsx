import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { PlaceOrderResult, PlaceOrderInput } from '@deity/falcon-shop-extension';

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput) {
    placeOrder(input: $input) {
      __typename
      ... on PlaceOrderSuccessfulResult {
        orderId
        orderReferenceNo
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

export class PlaceOrderMutation extends Mutation<PlaceOrderResponse, PlaceOrderInput> {
  static defaultProps = {
    mutation: PLACE_ORDER,
    refetchQueries: ['Cart', 'OrderList']
  };
}

export const usePlaceOrderMutation = (options?: MutationHookOptions<PlaceOrderResponse, PlaceOrderInput>) =>
  useMutation<PlaceOrderResponse, PlaceOrderInput>(PLACE_ORDER, {
    refetchQueries: ['Cart', 'OrderList'],
    ...(options || {})
  });
