import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { SetCheckoutAddressInput } from '@deity/falcon-shop-extension';

export const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress($input: SetCheckoutAddressInput!) {
    setBillingAddress(input: $input)
  }
`;

export type SetBillingAddressResponse = {
  setBillingAddress: boolean;
};

export class SetBillingAddressMutation extends Mutation<
  SetBillingAddressResponse,
  OperationInput<SetCheckoutAddressInput>
> {
  static defaultProps = {
    mutation: SET_BILLING_ADDRESS
  };
}

export const useSetBillingAddressMutation = (
  options?: MutationHookOptions<SetBillingAddressResponse, OperationInput<SetCheckoutAddressInput>>
) => useMutation<SetBillingAddressResponse, OperationInput<SetCheckoutAddressInput>>(SET_BILLING_ADDRESS, options);
