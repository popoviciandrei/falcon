import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { Address, EditAddressInput } from '@deity/falcon-shop-extension';

export const EDIT_ADDRESS = gql`
  mutation EditAddress($input: EditAddressInput!) {
    editAddress(input: $input) {
      id
    }
  }
`;

export type EditAddressResponse = {
  editAddress: Pick<Address, 'id'>;
};

export class EditAddressMutation extends Mutation<EditAddressResponse, OperationInput<EditAddressInput>> {
  static defaultProps = {
    mutation: EDIT_ADDRESS,
    refetchQueries: ['AddressList']
  };
}
