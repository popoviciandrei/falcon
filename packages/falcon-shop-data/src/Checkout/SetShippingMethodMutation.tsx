import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { SetCheckoutDetailsInput } from '@deity/falcon-shop-extension';

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($input: CheckoutDetailsInput!) {
    setShippingMethod(input: $input)
  }
`;

export type SetShippingMethodResponse = {
  setShippingMethod: boolean;
};

export class SetShippingMethodMutation extends Mutation<SetShippingMethodResponse, SetCheckoutDetailsInput> {
  static defaultProps = {
    mutation: SET_SHIPPING_METHOD,
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true
  };
}

export const useSetShippingMethodMutation = (
  options?: MutationHookOptions<SetShippingMethodResponse, SetCheckoutDetailsInput>
) =>
  useMutation<SetShippingMethodResponse, SetCheckoutDetailsInput>(SET_SHIPPING_METHOD, {
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
    ...(options || {})
  });
