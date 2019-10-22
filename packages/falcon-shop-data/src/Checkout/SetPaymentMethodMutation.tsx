import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { SetCheckoutDetailsInput } from '@deity/falcon-shop-extension';

export const SET_PAYMENT_METHOD = gql`
  mutation SetPaymentMethod($input: CheckoutDetailsInput!) {
    setPaymentMethod(input: $input)
  }
`;

export type SetPaymentMethodResponse = {
  setPaymentMethod: boolean;
};

export class SetPaymentMethodMutation extends Mutation<SetPaymentMethodResponse, SetCheckoutDetailsInput> {
  static defaultProps = {
    mutation: SET_PAYMENT_METHOD,
    refetchQueries: ['Cart']
  };
}

export const useSetPaymentMethodMutation = (
  options?: MutationHookOptions<SetPaymentMethodResponse, SetCheckoutDetailsInput>
) =>
  useMutation<SetPaymentMethodResponse, SetCheckoutDetailsInput>(SET_PAYMENT_METHOD, {
    refetchQueries: ['Cart'],
    ...(options || {})
  });
