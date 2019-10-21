import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';

export const REMOVE_ADDRESS = gql`
  mutation RemoveAddress($id: ID!) {
    removeAddress(id: $id)
  }
`;

export type RemoveAddressResponse = {
  removeAddress: boolean;
};

export type RemoveAddressVariables = {
  id: number;
};

export class RemoveAddressMutation extends Mutation<RemoveAddressResponse, RemoveAddressVariables> {
  static defaultProps = {
    mutation: REMOVE_ADDRESS,
    refetchQueries: ['AddressList']
  };
}
