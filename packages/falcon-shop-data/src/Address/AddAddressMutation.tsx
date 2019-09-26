import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { AddAddressInput, Address } from '@deity/falcon-shop-extension';

export const ADD_ADDRESS = gql`
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
    mutation: ADD_ADDRESS,
    refetchQueries: ['AddressList']
  };
}
