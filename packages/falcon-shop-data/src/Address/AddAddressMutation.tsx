import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { Address, AddAddressInput } from '@deity/falcon-shop-extension';

export const ADD_ADDRESS_MUTATION = gql`
  mutation AddAddress($input: AddAddressInput!) {
    addAddress(input: $input) {
      id
    }
  }
`;

export type AddAddressResponse = {
  addAddress: Pick<Address, 'id'>;
};

export class AddAddressMutation extends Mutation<AddAddressResponse, OperationInput<AddAddressInput>> {
  static defaultProps = {
    mutation: ADD_ADDRESS_MUTATION,
    refetchQueries: ['AddressList']
  };
}

export const useAddAddressMutation = (
  options: MutationHookOptions<AddAddressResponse, OperationInput<AddAddressInput>> = {}
) =>
  useMutation(ADD_ADDRESS_MUTATION, {
    refetchQueries: ['AddressList'],
    ...options
  });
