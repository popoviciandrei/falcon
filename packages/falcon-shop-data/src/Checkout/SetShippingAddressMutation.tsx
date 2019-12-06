import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { CheckoutAddressInput, SetCheckoutAddressInput } from '@deity/falcon-shop-extension';

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($input: SetCheckoutAddressInput!) {
    setShippingAddress(input: $input)
  }
`;

export type SetShippingAddressResponse = {
  setShippingAddress: boolean;
};

export class SetShippingAddressMutation extends Mutation<
  SetShippingAddressResponse,
  OperationInput<SetCheckoutAddressInput>
> {
  static defaultProps = {
    mutation: SET_SHIPPING_ADDRESS
  };
}

export const useSetShippingAddressMutation = (
  options?: MutationHookOptions<SetShippingAddressResponse, OperationInput<SetCheckoutAddressInput>>
) => useMutation<SetShippingAddressResponse, OperationInput<SetCheckoutAddressInput>>(SET_SHIPPING_ADDRESS, options);
